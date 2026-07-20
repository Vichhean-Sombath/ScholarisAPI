const {
    GetPaymentData,
    SelectedPaymentData,
    CreatePaymentData,
    UpdatePaymentData,
    DeletePaymentData,
    recordPaymentFromGateway,
    RecordStudentPaymentData
} = require('./payments.service');
const { ValidationCreatePayment, ValidationUpdatePayment } = require('./payments.validation');
const { SelectedInvoiceData } = require('../invoices/invoices.service');
const { createCheckoutSession, getSession, verifyWebhookSignature } = require('../../services/stripe.service');
const { generateKHQR, checkBakongAccount } = require('../../services/bakong.service');

const GetPayment = async (req, res, next) => {
    try {
        const paymentData = await GetPaymentData();

        res.status(200).json({
                message: 'Payment retrieved successfully!',
                data: paymentData
            });
    } catch (error) {
        next(error);
    }
}

const SelectPayment = async (req, res, next) => {
    try {
        const paymentData = await SelectedPaymentData(req.params.id);

        res.status(200).json({
                message: 'Payment retrieved successfully!',
                data: paymentData
            });
    } catch (error) {
        next(error);
    }
}

const CreatePayment = async (req, res, next) => {
    try {
        const validation = ValidationCreatePayment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const paymentData = await CreatePaymentData(req.body);

        res.status(201).json({
            message: 'Payment created successfully!',
            data: paymentData
        });
    } catch (error) {
        next(error);
    }
}

const UpdatePayment = async (req, res, next) => {
    try {
        const validation = ValidationUpdatePayment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const paymentData = await UpdatePaymentData(req.params.id, req.body);

        res.status(200).json({
            message: 'Payment updated successfully!',
            data: paymentData
        });
    } catch (error) {
        next(error);
    }
}

const DeletePayment = async (req, res, next) => {
    try {
        await DeletePaymentData(req.params.id);
        res.status(200).json({
                message: 'Payment deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

const StripeConfig = async (req, res, next) => {
    try {
        const publicKey = process.env.STRIPE_PUBLIC_KEY;
        if (!publicKey) {
            return res.status(500).json({ message: 'Stripe public key not configured.' });
        }

        res.status(200).json({
            message: 'Stripe public key retrieved.',
            data: { public_key: publicKey }
        });
    } catch (error) {
        next(error);
    }
};

const StripeCheckout = async (req, res, next) => {
    try {
        const { invoice_id, success_url, cancel_url } = req.body;
        if (!invoice_id) {
            return res.status(400).json({ message: 'Invoice ID is required.' });
        }

        const invoice = await SelectedInvoiceData(invoice_id);
        if (req.user.role === 'Student' && invoice.student_id !== req.user.student_id) {
            return res.status(403).json({ message: 'You are not authorized to pay this invoice.' });
        }

        const session = await createCheckoutSession(invoice, { success_url, cancel_url });

        res.status(200).json({
            message: 'Stripe checkout session created.',
            data: session
        });
    } catch (error) {
        next(error);
    }
};

const StripeSuccess = async (req, res, next) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ message: 'Session ID is required.' });
        }

        const session = await getSession(session_id);

        res.status(200).json({
            message: 'Payment completed.',
            data: {
                session_id,
                status: session.payment_status,
                invoice_id: session.metadata?.invoice_id
            }
        });
    } catch (error) {
        next(error);
    }
};

const StripeVerify = async (req, res, next) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ message: 'Session ID is required.' });
        }

        const session = await getSession(session_id);
        const invoice_id = session.metadata?.invoice_id;

        if (!invoice_id || session.payment_status !== 'paid') {
            return res.status(400).json({ message: 'Payment not completed or invoice not found.' });
        }

        const invoice = await SelectedInvoiceData(invoice_id);
        if (req.user.role === 'Student' && invoice.student_id !== req.user.student_id) {
            return res.status(403).json({ message: 'You are not authorized to pay this invoice.' });
        }

        const amount = session.amount_total / 100;
        const payment = await recordPaymentFromGateway({
            invoice_id: parseInt(invoice_id, 10),
            amount,
            payment_method: 'Stripe',
            transaction_reference: session.id,
            receipt_url: session.receipt_url || null
        });

        res.status(200).json({
            message: 'Payment verified and recorded successfully!',
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

const StripeCancel = async (req, res, next) => {
    res.status(200).json({
        message: 'Payment cancelled by user.'
    });
};

const StripeWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['stripe-signature'];
        const secret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!secret) {
            return res.status(500).json({ message: 'Stripe webhook secret not configured.' });
        }

        let event;
        try {
            event = verifyWebhookSignature(req.body, signature, secret);
        } catch (error) {
            return res.status(400).json({ message: `Webhook signature verification failed: ${error.message}` });
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const invoice_id = session.metadata?.invoice_id;
            const amount = session.amount_total / 100;

            if (invoice_id && session.payment_status === 'paid') {
                try {
                    await recordPaymentFromGateway({
                        invoice_id: parseInt(invoice_id, 10),
                        amount,
                        payment_method: 'Stripe',
                        transaction_reference: session.id,
                        receipt_url: session.receipt_url || null
                    });
                } catch (error) {
                    console.error('Stripe webhook payment recording failed:', error.message);
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        next(error);
    }
};

const CheckBakongAccount = async (req, res, next) => {
    try {
        const result = await checkBakongAccount();
        res.status(200).json({
            message: 'Bakong account check complete.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const BakongQR = async (req, res, next) => {
    try {
        const { invoice_id } = req.body;
        if (!invoice_id) {
            return res.status(400).json({ message: 'Invoice ID is required.' });
        }

        const invoice = await SelectedInvoiceData(invoice_id);
        if (req.user.role === 'Student' && invoice.student_id !== req.user.student_id) {
            return res.status(403).json({ message: 'You are not authorized to pay this invoice.' });
        }

        const qr = await generateKHQR(invoice);

        res.status(200).json({
            message: 'Bakong KHQR generated.',
            data: qr
        });
    } catch (error) {
        next(error);
    }
};

const RecordStudentPayment = async (req, res, next) => {
    try {
        const { invoice_id } = req.body;
        if (!invoice_id) {
            return res.status(400).json({ message: 'Invoice ID is required.' });
        }

        const invoice = await SelectedInvoiceData(invoice_id);
        if (req.user.role === 'Student' && invoice.student_id !== req.user.student_id) {
            return res.status(403).json({ message: 'You are not authorized to pay this invoice.' });
        }

        const payment = await RecordStudentPaymentData({
            invoice_id,
            user_id: req.user.user_id,
            payment_method: 'Stripe'
        });

        res.status(201).json({
            message: 'Payment recorded successfully!',
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

const BakongWebhook = async (req, res, next) => {
    try {
        const payload = req.body;
        console.log('Bakong webhook received:', JSON.stringify(payload));

        const invoice_id = payload.invoice_id ||
            (payload.reference1 ? parseInt(payload.reference1.replace('inv_', ''), 10) : null) ||
            (payload.description ? parseInt(payload.description.replace(/\D/g, ''), 10) : null);

        const amount = parseFloat(payload.amount);
        const transaction_reference = payload.transactionId || payload.transactionReference || payload.referenceId || null;

        if (invoice_id && !isNaN(amount) && transaction_reference) {
            try {
                await recordPaymentFromGateway({
                    invoice_id,
                    amount,
                    payment_method: 'BakongKHQR',
                    transaction_reference,
                    receipt_url: payload.receiptUrl || null
                });
            } catch (error) {
                console.error('Bakong webhook payment recording failed:', error.message);
            }
        } else {
            console.warn('Bakong webhook could not extract invoice_id, amount, or transaction_reference.');
        }

        res.status(200).json({ received: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetPayment,
    SelectPayment,
    CreatePayment,
    UpdatePayment,
    DeletePayment,
    StripeConfig,
    StripeCheckout,
    StripeSuccess,
    StripeCancel,
    StripeWebhook,
    StripeVerify,
    BakongQR,
    CheckBakongAccount,
    BakongWebhook,
    RecordStudentPayment
}
