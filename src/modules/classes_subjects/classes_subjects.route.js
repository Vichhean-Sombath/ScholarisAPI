const { GetClassSubject, SelectClassSubject, CreateClassSubject, DeleteClassSubject } = require('./classes_subjects.controller');
const AccessToken = require('../../middleware/authenticate');

const ClassSubjectController = app => {
    app.get('/class_subject/data', AccessToken, GetClassSubject);
    app.get('/class_subject/data/:id', AccessToken, SelectClassSubject);
    app.post('/class_subject/data', AccessToken, CreateClassSubject);
    app.delete('/class_subject/data/:id', AccessToken, DeleteClassSubject);
}

module.exports = ClassSubjectController;