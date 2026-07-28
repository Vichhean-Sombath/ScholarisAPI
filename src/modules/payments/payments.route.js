const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const {
    GetPayment,
    SelectPayment,
    CreatePayment,
    UpdatePayment,
    DeletePayment,
    StripeConfig,
    StripeCheckout,
    StripeSuccess,
    StripeCancel,
    StripeVerify,
    BakongQR,
    BakongVerify,
    CheckBakongAccount,
    RecordStudentPayment
} = require('./payments.controller');

const PaymentController = app => {
    app.get('/payment/data', AccessToken, Authorize('Admin'), GetPayment);
    app.get('/payment/data/:id', AccessToken, Authorize('Admin'), SelectPayment);
    app.post('/payment/create', AccessToken, Authorize('Admin'), CreatePayment);
    app.put('/payment/update/:id', AccessToken, Authorize('Admin'), UpdatePayment);
    app.delete('/payment/delete/:id', AccessToken, Authorize('Admin'), DeletePayment);

    app.get('/payment/stripe/config', StripeConfig);
    app.post('/payment/stripe/checkout', AccessToken, Authorize('Admin', 'Student'), StripeCheckout);
    app.get('/payment/stripe/success', StripeSuccess);
    app.get('/payment/stripe/cancel', StripeCancel);
    app.post('/payment/stripe/verify', AccessToken, Authorize('Admin', 'Student'), StripeVerify);

    app.post('/payment/bakong/qr', AccessToken, Authorize('Admin', 'Student'), BakongQR);
    app.post('/payment/bakong/verify', AccessToken, Authorize('Admin', 'Student'), BakongVerify);
    app.get('/payment/bakong/account', AccessToken, Authorize('Admin'), CheckBakongAccount);

    app.post('/payment/stripe/record', AccessToken, Authorize('Admin', 'Student'), RecordStudentPayment);
}

module.exports = PaymentController;
