const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const {
    GetClassEnrollment,
    SelectClassEnrollment,
    CreateClassEnrollment,
    UpdateClassEnrollment,
    DeleteClassEnrollment
} = require('./class_enrollments.controller');

const ClassEnrollmentController = app => {
    app.get('/class-enrollment/data', AccessToken, Authorize('Admin', 'Teacher'), GetClassEnrollment);
    app.get('/class-enrollment/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectClassEnrollment);
    app.post('/class-enrollment/create', AccessToken, Authorize('Admin'), CreateClassEnrollment);
    app.put('/class-enrollment/update/:id', AccessToken, Authorize('Admin'), UpdateClassEnrollment);
    app.delete('/class-enrollment/delete/:id', AccessToken, Authorize('Admin'), DeleteClassEnrollment);
};

module.exports = ClassEnrollmentController;
