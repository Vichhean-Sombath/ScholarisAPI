const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetInvoice, SelectInvoice, CreateInvoice, UpdateInvoice, DeleteInvoice } = require('./invoices.controller');

const InvoiceController = app => {
    app.get('/invoice/data', AccessToken, Authorize('Admin'), GetInvoice);
    app.get('/invoice/data/:id', AccessToken, Authorize('Admin'), SelectInvoice);
    app.post('/invoice/create', AccessToken, Authorize('Admin'), CreateInvoice);
    app.put('/invoice/update/:id', AccessToken, Authorize('Admin'), UpdateInvoice);
    app.delete('/invoice/delete/:id', AccessToken, Authorize('Admin'), DeleteInvoice);
}

module.exports = InvoiceController;
