const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetAssessment, SelectAssessment, CreateAssessment, UpdateAssessment, DeleteAssessment } = require('./assessments.controller');

const AssessmentController = app => {
    app.get('/assessment/data', AccessToken, Authorize('Admin', 'Teacher'), GetAssessment);
    app.get('/assessment/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectAssessment);
    app.post('/assessment/create', AccessToken, Authorize('Admin', 'Teacher'), CreateAssessment);
    app.put('/assessment/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateAssessment);
    app.delete('/assessment/delete/:id', AccessToken, Authorize('Admin', 'Teacher'), DeleteAssessment);
}

module.exports = AssessmentController;
