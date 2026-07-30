const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetFinalGrade, SelectFinalGrade, CreateFinalGrade, UpdateFinalGrade, DeleteFinalGrade } = require('./final_grades.controller');

const FinalGradeController = app => {
    app.get('/final-grade/data', AccessToken, Authorize('Admin'), GetFinalGrade);
    app.get('/final-grade/data/:id', AccessToken, Authorize('Admin'), SelectFinalGrade);
    app.post('/final-grade/create', AccessToken, Authorize('Admin'), CreateFinalGrade);
    app.put('/final-grade/update/:id', AccessToken, Authorize('Admin'), UpdateFinalGrade);
    app.delete('/final-grade/delete/:id', AccessToken, Authorize('Admin'), DeleteFinalGrade);
}

module.exports = FinalGradeController;
