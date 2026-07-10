const AccessToken = require('../../middleware/authenticate');
const { GetGrade, SelectGrade, CreateGrade, UpdateGrade, DeleteGrade } = require('./grades.controller');

const GradeController = app => {
    app.get('/grade/data', AccessToken, GetGrade);
    app.get('/grade/data/:id', AccessToken, SelectGrade);
    app.post('/grade/create', AccessToken, CreateGrade);
    app.put('/grade/update/:id', AccessToken, UpdateGrade);
    app.delete('/grade/delete/:id', AccessToken, DeleteGrade);
}

module.exports = GradeController;
