const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Payments = require('../../models/payments.model');
const Invoices = require('../../models/invoices.model');
const Users = require('../../models/users.model');
const FeeStructures = require('../../models/fee_structures.model');
const { sendPaymentNotification } = require('../../services/telegram.service');
const { sendReceiptEmail } = require('../../services/email.service');
const { buildPaymentContext } = require('../../services/payment.helpers');
require('../../models/mappingContext');

const normalizePaymentMethod = (method) => {
    const map = {
        stripe: 'Stripe',
        bakongkhqr: 'BakongKHQR'
    };
    return map[method?.toLowerCase()] || method;
};

const getSystemUserId = async () => {
    const systemUserId = process.env.SYSTEM_USER_ID;
    if (systemUserId) {
        const id = parseInt(systemUserId, 10);
        const existing = await Users.findOne({ user_id: id });
        if (existing) return id;
    }

    let user = await Users.findOne({ username: 'system_automation' });

    if (!user) {
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const lastUser = await Users.findOne().sort({ user_id: -1 });
        const user_id = lastUser ? lastUser.user_id + 1 : 1;

        user = await Users.create({
            user_id,
            username: 'system_automation',
            email: 'system@scholaris.local',
            password_hash: hashedPassword,
            role: 'Admin',
            status: 'Active'
        });
    }

    return user.user_id;
};

const updateInvoiceAfterPaymentChange = async (invoice_id) => {
    const invoice = await Invoices.findOne({ invoice_id }).populate('payments');
    if (!invoice) return;

    const totalPaid = (invoice.payments || []).reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    let status = 'Unpaid';
    if (totalPaid >= parseFloat(invoice.total_amount)) status = 'Paid';
    else if (totalPaid > 0) status = 'Partial';

    invoice.amount_paid = totalPaid;
    invoice.status = status;
    await invoice.save();
};

const notifyPaymentRecorded = async (invoice_id, payment) => {
    try {
        console.log('Building payment notification context for invoice:', invoice_id);
        const context = await buildPaymentContext(invoice_id, payment);
        if (!context) {
            console.warn('Payment notification skipped: could not build payment context.');
            return;
        }

        console.log('Sending payment notifications for invoice:', invoice_id);
        await sendPaymentNotification(context);
        await sendReceiptEmail(context);
        console.log('Payment notifications completed for invoice:', invoice_id);
    } catch (error) {
        console.error('Payment notification failed:', error.message);
    }
};

const recordPaymentFromGateway = async ({ invoice_id, amount, payment_method, transaction_reference, receipt_url }) => {
    console.log(`Recording ${payment_method} payment for invoice ${invoice_id}, ref=${transaction_reference}, amount=${amount}`);

    if (transaction_reference) {
        const existing = await Payments.findOne({ transaction_reference });
        if (existing) {
            console.log('Payment with transaction reference already recorded:', transaction_reference);
            return existing;
        }
    }

    const invoice = await Invoices.findOne({ invoice_id });
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    const systemUserId = await getSystemUserId();

    const lastPayment = await Payments.findOne().sort({ payment_id: -1 });
    const payment_id = lastPayment ? lastPayment.payment_id + 1 : 1;

    const payment = await Payments.create({
        payment_id,
        invoice_id,
        payment_date: new Date(),
        amount: parseFloat(amount),
        payment_method: normalizePaymentMethod(payment_method),
        transaction_reference,
        receipt_url,
        recorded_by: systemUserId,
        notes: `Auto-recorded via ${payment_method} gateway`
    });

    await updateInvoiceAfterPaymentChange(invoice_id);
    await notifyPaymentRecorded(invoice_id, payment);

    return payment;
};

const GetPaymentData = async () => {
    return await Payments.find()
        .populate({ path: 'invoice', select: 'invoice_id invoice_number total_amount amount_paid status' })
        .populate({ path: 'user', select: 'user_id username' });
};

const SelectedPaymentData = async (payment_id) => {
    const payment = await Payments.findOne({ payment_id })
        .populate({ path: 'invoice', select: 'invoice_id invoice_number total_amount amount_paid status' })
        .populate({ path: 'user', select: 'user_id username' });

    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    return payment;
};

const CreatePaymentData = async (paymentData) => {
    const { invoice_id, payment_date, amount, payment_method, receipt_url, recorded_by, notes, transaction_reference } = paymentData;

    const invoice = await Invoices.findOne({ invoice_id });
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    const user = await Users.findOne({ user_id: recorded_by });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    if (transaction_reference) {
        const existing = await Payments.findOne({ transaction_reference });
        if (existing) {
            const err = new Error('Transaction reference already exists!');
            err.statusCode = 409;
            throw err;
        }
    }

    const lastPayment = await Payments.findOne().sort({ payment_id: -1 });
    const payment_id = lastPayment ? lastPayment.payment_id + 1 : 1;

    const payment = await Payments.create({
        payment_id,
        invoice_id,
        payment_date,
        amount,
        payment_method: normalizePaymentMethod(payment_method),
        receipt_url,
        transaction_reference,
        recorded_by,
        notes
    });

    await updateInvoiceAfterPaymentChange(invoice_id);
    await notifyPaymentRecorded(invoice_id, payment);

    return payment;
};

const RecordStudentPaymentData = async ({ invoice_id, payment_method = 'Stripe', user_id, transaction_reference }) => {
    const invoice = await Invoices.findOne({ invoice_id }).populate('feeStructure');
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    const user = await Users.findOne({ user_id });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    const balance = parseFloat(invoice.total_amount) - parseFloat(invoice.amount_paid);
    if (balance <= 0) {
        const err = new Error('Invoice is already fully paid!');
        err.statusCode = 400;
        throw err;
    }

    const finalReference = transaction_reference || `student_${user_id}_${Date.now()}`;
    const existing = await Payments.findOne({ transaction_reference: finalReference });
    if (existing) {
        const err = new Error('Transaction reference already exists!');
        err.statusCode = 409;
        throw err;
    }

    const lastPayment = await Payments.findOne().sort({ payment_id: -1 });
    const payment_id = lastPayment ? lastPayment.payment_id + 1 : 1;

    const payment = await Payments.create({
        payment_id,
        invoice_id,
        payment_date: new Date(),
        amount: balance,
        payment_method: normalizePaymentMethod(payment_method),
        transaction_reference: finalReference,
        receipt_url: null,
        recorded_by: user_id,
        notes: `Recorded by ${user.role} via student portal`
    });

    await updateInvoiceAfterPaymentChange(invoice_id);
    await notifyPaymentRecorded(invoice_id, payment);

    return payment;
};

const UpdatePaymentData = async (payment_id, paymentData) => {
    const payment = await Payments.findOne({ payment_id });
    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (paymentData.invoice_id) {
        const invoice = await Invoices.findOne({ invoice_id: paymentData.invoice_id });
        if (!invoice) {
            const err = new Error('Invoice not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (paymentData.recorded_by) {
        const user = await Users.findOne({ user_id: paymentData.recorded_by });
        if (!user) {
            const err = new Error('User not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const normalizedData = { ...paymentData };
    if (normalizedData.payment_method) {
        normalizedData.payment_method = normalizePaymentMethod(normalizedData.payment_method);
    }

    const originalInvoiceId = payment.invoice_id;
    const newInvoiceId = normalizedData.invoice_id || originalInvoiceId;

    Object.assign(payment, normalizedData);
    await payment.save();

    const invoicesToUpdate = newInvoiceId !== originalInvoiceId
        ? [originalInvoiceId, newInvoiceId]
        : [newInvoiceId];

    for (const id of invoicesToUpdate) {
        await updateInvoiceAfterPaymentChange(id);
    }

    return payment;
};

const DeletePaymentData = async (payment_id) => {
    const payment = await Payments.findOne({ payment_id });
    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    const invoice_id = payment.invoice_id;
    await Payments.deleteOne({ payment_id });
    await updateInvoiceAfterPaymentChange(invoice_id);
};

module.exports = {
    GetPaymentData,
    SelectedPaymentData,
    CreatePaymentData,
    UpdatePaymentData,
    DeletePaymentData,
    recordPaymentFromGateway,
    RecordStudentPaymentData,
    normalizePaymentMethod,
    getSystemUserId
};
