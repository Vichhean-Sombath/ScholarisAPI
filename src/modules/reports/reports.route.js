const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetReports } = require('./reports.controller');

const ReportsController = (app) => {
    app.get('/reports/summary', AccessToken, Authorize('Admin'), GetReports);
};

module.exports = ReportsController;
