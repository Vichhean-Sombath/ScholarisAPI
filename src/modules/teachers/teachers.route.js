const { GetTeacher, UpdateTeacher, SelectTeacher } = require('./teachers.controller');
const AccessToken = require('../../middleware/authenticate');

const TeacherController = app => {
    app.get('/teacher/data', AccessToken, GetTeacher);
    app.get('/teacher/data/:id', AccessToken, SelectTeacher);
    app.put('/teacher/update/:id', AccessToken, UpdateTeacher);
}

module.exports = TeacherController;