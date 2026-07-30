const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetGrade, SelectGrade, CreateGrade, UpdateGrade, DeleteGrade } = require('./grades.controller');

const GradeController = app => {
    app.get('/grade/data', AccessToken, Authorize('Admin', 'Teacher'), GetGrade);
    app.get('/grade/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectGrade);
    app.post('/grade/create', AccessToken, Authorize('Admin', 'Teacher'), CreateGrade);
    app.put('/grade/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateGrade);
    app.delete('/grade/delete/:id', AccessToken, Authorize('Admin', 'Teacher'), DeleteGrade);
}

module.exports = GradeController;
