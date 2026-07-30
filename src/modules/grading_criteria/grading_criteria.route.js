const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetGradingCriteria, SelectGradingCriteria, CreateGradingCriteria, UpdateGradingCriteria, DeleteGradingCriteria } = require('./grading_criteria.controller');

const GradingCriteriaController = app => {
    app.get('/grading-criteria/data', AccessToken, Authorize('Admin', 'Teacher'), GetGradingCriteria);
    app.get('/grading-criteria/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectGradingCriteria);
    app.post('/grading-criteria/create', AccessToken, Authorize('Admin'), CreateGradingCriteria);
    app.put('/grading-criteria/update/:id', AccessToken, Authorize('Admin'), UpdateGradingCriteria);
    app.delete('/grading-criteria/delete/:id', AccessToken, Authorize('Admin'), DeleteGradingCriteria);
}

module.exports = GradingCriteriaController;
