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
const { generateKHQR, checkBakongAccount, checkTransactionByMd5, KHR_PER_USD } = require('../../services/bakong.service');
const BakongQRRequests = require('../../models/bakong_qr_requests.model');

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

const BakongVerify = async (req, res, next) => {
    try {
        const { md5 } = req.body;
        if (!md5) {
            return res.status(400).json({ message: 'md5 is required.' });
        }

        const qrRequest = await BakongQRRequests.findOne({ where: { md5 } });
        if (!qrRequest) {
            return res.status(404).json({ message: 'QR request not found.' });
        }

        if (qrRequest.status === 'Pending' && new Date() > new Date(qrRequest.expires_at)) {
            await qrRequest.update({ status: 'Expired' });
        }

        let bakongStatus = null;
        let paymentId = null;

        // Poll Bakong's API while the local request is still pending.
        if (qrRequest.status === 'Pending') {
            try {
                const bakongResult = await checkTransactionByMd5(md5);
                console.log('Bakong check_transaction_by_md5 response:', JSON.stringify(bakongResult));
                bakongStatus = bakongResult;

                if (bakongResult?.responseCode === 0 && bakongResult?.data) {
                    const tx = bakongResult.data;
                    const currency = String(tx.currency || 'KHR').toUpperCase();
                    const rawAmount = parseFloat(tx.amount);
                    const expectedKhr = parseFloat(qrRequest.amount_khr);
                    const expectedUsd = parseFloat(qrRequest.amount_usd);
                    let amountUsd;
                    let amountMatched;

                    if (currency === 'USD') {
                        amountUsd = rawAmount;
                        amountMatched = Math.abs(rawAmount - expectedUsd) <= 0.01;
                    } else {
                        amountUsd = rawAmount / KHR_PER_USD;
                        amountMatched = Math.abs(rawAmount - expectedKhr) <= 1;
                    }

                    if (!isNaN(rawAmount) && amountMatched) {
                        const payment = await recordPaymentFromGateway({
                            invoice_id: qrRequest.invoice_id,
                            amount: amountUsd,
                            payment_method: 'BakongKHQR',
                            transaction_reference: tx.hash || md5,
                            receipt_url: tx.receiptUrl || null
                        });

                        await qrRequest.update({ status: 'Paid', paid_at: new Date() });
                        paymentId = payment.payment_id;
                    }
                }
            } catch (error) {
                console.error('Bakong transaction check failed:', error.message);
                bakongStatus = { error: error.message };
            }
        }

        const refreshed = await BakongQRRequests.findOne({ where: { md5 } });

        res.status(200).json({
            message: 'Bakong QR status retrieved.',
            data: {
                md5: refreshed.md5,
                invoice_id: refreshed.invoice_id,
                status: refreshed.status,
                paid: refreshed.status === 'Paid',
                expired: refreshed.status === 'Expired',
                amount_khr: parseFloat(refreshed.amount_khr),
                amount_usd: parseFloat(refreshed.amount_usd),
                expires_at: refreshed.expires_at,
                paid_at: refreshed.paid_at,
                payment_id: paymentId,
                bakong_status: bakongStatus
            }
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

        // Bakong callbacks identify the QR by its md5 hash, not by invoice_id/reference1.
        const md5 = payload.md5 || payload.data?.md5 || null;
        const currency = (payload.currency || payload.data?.currency || 'KHR').toString().toUpperCase();
        const rawAmount = parseFloat(payload.amount ?? payload.data?.amount);
        const transaction_reference = payload.hash || payload.transactionHash || payload.data?.hash || md5;

        if (!md5 || isNaN(rawAmount) || !transaction_reference) {
            console.warn('Bakong webhook could not extract md5, amount, or transaction_reference.', { md5, rawAmount, transaction_reference });
            return res.status(200).json({ received: true });
        }

        const qrRequest = await BakongQRRequests.findOne({
            where: { md5, status: 'Pending' }
        });

        if (!qrRequest) {
            console.warn('Bakong webhook: no pending QR request found for md5:', md5);
            return res.status(200).json({ received: true });
        }

        if (new Date() > new Date(qrRequest.expires_at)) {
            await qrRequest.update({ status: 'Expired' });
            console.warn('Bakong webhook: QR request expired for md5:', md5);
            return res.status(200).json({ received: true });
        }

        const expectedKhr = parseFloat(qrRequest.amount_khr);
        const expectedUsd = parseFloat(qrRequest.amount_usd);
        let amountUsd;
        let amountMatched;

        if (currency === 'USD') {
            amountUsd = rawAmount;
            amountMatched = Math.abs(rawAmount - expectedUsd) <= 0.01;
        } else {
            // Bakong QR was generated in KHR; assume callback amount is in KHR.
            amountUsd = rawAmount / KHR_PER_USD;
            amountMatched = Math.abs(rawAmount - expectedKhr) <= 1;
        }

        if (!amountMatched) {
            console.warn(`Bakong webhook: amount mismatch for md5 ${md5}. currency=${currency}, expectedKhr=${expectedKhr}, expectedUsd=${expectedUsd}, received=${rawAmount}`);
            await qrRequest.update({ status: 'Failed' });
            return res.status(200).json({ received: true });
        }

        try {
            await recordPaymentFromGateway({
                invoice_id: qrRequest.invoice_id,
                amount: amountUsd,
                payment_method: 'BakongKHQR',
                transaction_reference,
                receipt_url: payload.receiptUrl || payload.data?.receiptUrl || null
            });

            await qrRequest.update({ status: 'Paid', paid_at: new Date() });
            console.log('Bakong webhook: payment recorded for invoice', qrRequest.invoice_id);
        } catch (error) {
            console.error('Bakong webhook payment recording failed:', error.message);
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
    BakongVerify,
    CheckBakongAccount,
    BakongWebhook,
    RecordStudentPayment
}
