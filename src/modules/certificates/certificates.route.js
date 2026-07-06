const { GetCertificate, SelectCertificate, CreateCertificate, DeleteCertificate } = require('./certificates.controller');
const AccessToken = require('../../middleware/authenticate');

const CertificateController = app => {
    app.get('/certificate/data', AccessToken, GetCertificate);
    app.get('/certificate/data/:search', AccessToken, SelectCertificate);
    app.post('/certificate/create', AccessToken, CreateCertificate);
    app.delete('/certificate/delete/:id', AccessToken, DeleteCertificate);
}

module.exports = CertificateController;