const { GetStudent, UpdateStudent, SelectStudent } = require('./students.controller');
const AccessToken = require('../../middleware/authenticate');

const StudentController = app => {
    app.get('/student/data', AccessToken, GetStudent);
    app.get('/student/data/:id', AccessToken, SelectStudent);
    app.put('/student/update/:id', AccessToken, UpdateStudent);
}

module.exports = StudentController;