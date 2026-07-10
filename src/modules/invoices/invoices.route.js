const AccessToken = require('../../middleware/authenticate');
const { GetInvoice, SelectInvoice, CreateInvoice, UpdateInvoice, DeleteInvoice } = require('./invoices.controller');

const InvoiceController = app => {
    app.get('/invoice/data', AccessToken, GetInvoice);
    app.get('/invoice/data/:id', AccessToken, SelectInvoice);
    app.post('/invoice/create', AccessToken, CreateInvoice);
    app.put('/invoice/update/:id', AccessToken, UpdateInvoice);
    app.delete('/invoice/delete/:id', AccessToken, DeleteInvoice);
}

module.exports = InvoiceController;
