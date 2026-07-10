const { GetStudent, UpdateStudent, SelectStudent } = require('./students.controller');
const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');

const StudentController = app => {
    app.get('/student/data', AccessToken, Authorize('Admin', 'Teacher'), GetStudent);
    app.get('/student/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectStudent);
    app.put('/student/update/:id', AccessToken, Authorize('Admin'), UpdateStudent);
}

module.exports = StudentController;