const AccessToken = require('../../middleware/authenticate');
const { GetAssessment, SelectAssessment, CreateAssessment, UpdateAssessment, DeleteAssessment } = require('./assessments.controller');

const AssessmentController = app => {
    app.get('/assessment/data', AccessToken, GetAssessment);
    app.get('/assessment/data/:id', AccessToken, SelectAssessment);
    app.post('/assessment/create', AccessToken, CreateAssessment);
    app.put('/assessment/update/:id', AccessToken, UpdateAssessment);
    app.delete('/assessment/delete/:id', AccessToken, DeleteAssessment);
}

module.exports = AssessmentController;
