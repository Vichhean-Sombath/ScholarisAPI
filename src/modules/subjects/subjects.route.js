const AccessToken = require('../../middleware/authenticate');
const { GetSubject, SelectSubject, CreateSubject, UpdateSubject, DeleteSubject } = require('./subjects.controller');

const SubjectController = app => {
    app.get('/subject/data', AccessToken, GetSubject);
    app.get('/subject/data/:id', AccessToken, SelectSubject);
    app.post('/subject/create', AccessToken, CreateSubject);
    app.put('/subject/update/:id', AccessToken, UpdateSubject);
    app.delete('/subject/delete/:id', AccessToken, DeleteSubject);
}

module.exports = SubjectController;