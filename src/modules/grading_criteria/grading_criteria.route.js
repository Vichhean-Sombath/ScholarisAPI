const AccessToken = require('../../middleware/authenticate');
const { GetGradingCriteria, SelectGradingCriteria, CreateGradingCriteria, UpdateGradingCriteria, DeleteGradingCriteria } = require('./grading_criteria.controller');

const GradingCriteriaController = app => {
    app.get('/grading-criteria/data', AccessToken, GetGradingCriteria);
    app.get('/grading-criteria/data/:id', AccessToken, SelectGradingCriteria);
    app.post('/grading-criteria/create', AccessToken, CreateGradingCriteria);
    app.put('/grading-criteria/update/:id', AccessToken, UpdateGradingCriteria);
    app.delete('/grading-criteria/delete/:id', AccessToken, DeleteGradingCriteria);
}

module.exports = GradingCriteriaController;
