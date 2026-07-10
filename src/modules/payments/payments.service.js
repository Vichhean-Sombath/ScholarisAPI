const Payments = require('../../models/payments.model');
const Invoices = require('../../models/invoices.model');
const Users = require('../../models/users.model');

const updateInvoiceAfterPaymentChange = async (invoice_id) => {
    const invoice = await Invoices.findByPk(invoice_id, {
        include: [{ model: Payments, attributes: ['amount'] }]
    });
    if (!invoice) return;

    const totalPaid = invoice.Payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    let status = 'Unpaid';
    if (totalPaid >= parseFloat(invoice.total_amount)) status = 'Paid';
    else if (totalPaid > 0) status = 'Partial';

    await invoice.update({ amount_paid: totalPaid, status });
};

const GetPaymentData = async () => {
    return await Payments.findAll({
        include: [
            { model: Invoices, attributes: ['invoice_id', 'invoice_number', 'total_amount', 'amount_paid', 'status'] },
            { model: Users, attributes: ['user_id', 'username'] }
        ]
    });
};

const SelectedPaymentData = async (payment_id) => {
    const payment = await Payments.findByPk(payment_id, {
        include: [
            { model: Invoices, attributes: ['invoice_id', 'invoice_number', 'total_amount', 'amount_paid', 'status'] },
            { model: Users, attributes: ['user_id', 'username'] }
        ]
    });

    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    return payment;
};

const CreatePaymentData = async (paymentData) => {
    const { invoice_id, payment_date, amount, payment_method, receipt_url, recorded_by, notes } = paymentData;

    const invoice = await Invoices.findByPk(invoice_id);
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    const user = await Users.findByPk(recorded_by);
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    const payment = await Payments.create({
        invoice_id,
        payment_date,
        amount,
        payment_method,
        receipt_url,
        recorded_by,
        notes
    });

    await updateInvoiceAfterPaymentChange(invoice_id);

    return payment;
};

const UpdatePaymentData = async (payment_id, paymentData) => {
    const payment = await Payments.findByPk(payment_id);
    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (paymentData.invoice_id) {
        const invoice = await Invoices.findByPk(paymentData.invoice_id);
        if (!invoice) {
            const err = new Error('Invoice not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (paymentData.recorded_by) {
        const user = await Users.findByPk(paymentData.recorded_by);
        if (!user) {
            const err = new Error('User not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const originalInvoiceId = payment.invoice_id;
    const newInvoiceId = paymentData.invoice_id || originalInvoiceId;

    await payment.update(paymentData);

    const invoicesToUpdate = newInvoiceId !== originalInvoiceId
        ? [originalInvoiceId, newInvoiceId]
        : [newInvoiceId];

    for (const id of invoicesToUpdate) {
        await updateInvoiceAfterPaymentChange(id);
    }

    return payment;
};

const DeletePaymentData = async (payment_id) => {
    const payment = await Payments.findByPk(payment_id);
    if (!payment) {
        const err = new Error('Payment not found!');
        err.statusCode = 404;
        throw err;
    }

    const invoice_id = payment.invoice_id;
    await payment.destroy();
    await updateInvoiceAfterPaymentChange(invoice_id);
};

module.exports = {
    GetPaymentData,
    SelectedPaymentData,
    CreatePaymentData,
    UpdatePaymentData,
    DeletePaymentData
};
