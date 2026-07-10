const AccessToken = require('../../middleware/authenticate');
const { GetFinalGrade, SelectFinalGrade, CreateFinalGrade, UpdateFinalGrade, DeleteFinalGrade } = require('./final_grades.controller');

const FinalGradeController = app => {
    app.get('/final-grade/data', AccessToken, GetFinalGrade);
    app.get('/final-grade/data/:id', AccessToken, SelectFinalGrade);
    app.post('/final-grade/create', AccessToken, CreateFinalGrade);
    app.put('/final-grade/update/:id', AccessToken, UpdateFinalGrade);
    app.delete('/final-grade/delete/:id', AccessToken, DeleteFinalGrade);
}

module.exports = FinalGradeController;
