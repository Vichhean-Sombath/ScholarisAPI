const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetSubject, SelectSubject, CreateSubject, UpdateSubject, DeleteSubject } = require('./subjects.controller');

const SubjectController = app => {
    app.get('/subject/data', AccessToken, Authorize('Admin', 'Teacher'), GetSubject);
    app.get('/subject/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectSubject);
    app.post('/subject/create', AccessToken, Authorize('Admin'), CreateSubject);
    app.put('/subject/update/:id', AccessToken, Authorize('Admin'), UpdateSubject);
    app.delete('/subject/delete/:id', AccessToken, Authorize('Admin'), DeleteSubject);
}

module.exports = SubjectController;