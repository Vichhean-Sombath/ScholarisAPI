const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetPayment, SelectPayment, CreatePayment, UpdatePayment, DeletePayment } = require('./payments.controller');

const PaymentController = app => {
    app.get('/payment/data', AccessToken, Authorize('Admin'), GetPayment);
    app.get('/payment/data/:id', AccessToken, Authorize('Admin'), SelectPayment);
    app.post('/payment/create', AccessToken, Authorize('Admin'), CreatePayment);
    app.put('/payment/update/:id', AccessToken, Authorize('Admin'), UpdatePayment);
    app.delete('/payment/delete/:id', AccessToken, Authorize('Admin'), DeletePayment);
}

module.exports = PaymentController;
