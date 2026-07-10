const AccessToken = require('../../middleware/authenticate');
const { GetPayment, SelectPayment, CreatePayment, UpdatePayment, DeletePayment } = require('./payments.controller');

const PaymentController = app => {
    app.get('/payment/data', AccessToken, GetPayment);
    app.get('/payment/data/:id', AccessToken, SelectPayment);
    app.post('/payment/create', AccessToken, CreatePayment);
    app.put('/payment/update/:id', AccessToken, UpdatePayment);
    app.delete('/payment/delete/:id', AccessToken, DeletePayment);
}

module.exports = PaymentController;
