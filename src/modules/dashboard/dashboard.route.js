const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetDashboard } = require('./dashboard.controller');

const DashboardController = (app) => {
    app.get('/dashboard/summary', AccessToken, Authorize('Admin'), GetDashboard);
};

module.exports = DashboardController;
