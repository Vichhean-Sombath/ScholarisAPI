const AccessToken = require('../../middleware/authenticate');
const {
    GetClassEnrollment,
    SelectClassEnrollment,
    CreateClassEnrollment,
    UpdateClassEnrollment,
    DeleteClassEnrollment
} = require('./class_enrollments.controller');

const ClassEnrollmentController = app => {
    app.get('/class-enrollment/data', AccessToken, GetClassEnrollment);
    app.get('/class-enrollment/data/:id', AccessToken, SelectClassEnrollment);
    app.post('/class-enrollment/create', AccessToken, CreateClassEnrollment);
    app.put('/class-enrollment/update/:id', AccessToken, UpdateClassEnrollment);
    app.delete('/class-enrollment/delete/:id', AccessToken, DeleteClassEnrollment);
};

module.exports = ClassEnrollmentController;
