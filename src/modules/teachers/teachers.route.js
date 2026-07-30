const { GetTeacher, UpdateTeacher, SelectTeacher } = require('./teachers.controller');
const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');

const TeacherController = app => {
    app.get('/teacher/data', AccessToken, Authorize('Admin', 'Teacher'), GetTeacher);
    app.get('/teacher/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectTeacher);
    app.put('/teacher/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateTeacher);
}

module.exports = TeacherController;