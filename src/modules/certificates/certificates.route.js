const { GetCertificate, SelectCertificate, CreateCertificate, DeleteCertificate } = require('./certificates.controller');
const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');

const CertificateController = app => {
    app.get('/certificate/data', AccessToken, Authorize('Admin'), GetCertificate);
    app.get('/certificate/data/:id', AccessToken, Authorize('Admin'), SelectCertificate);
    app.post('/certificate/create', AccessToken, Authorize('Admin'), CreateCertificate);
    app.delete('/certificate/delete/:id', AccessToken, Authorize('Admin'), DeleteCertificate);
}

module.exports = CertificateController;