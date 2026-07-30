const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetSchedule, SelectSchedule, CreateSchedule, UpdateSchedule, DeleteSchedule } = require('./schedules.controller');

const ScheduleController = app => {
    app.get('/schedule/data', AccessToken, Authorize('Admin', 'Teacher'), GetSchedule);
    app.get('/schedule/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectSchedule);
    app.post('/schedule/create', AccessToken, Authorize('Admin', 'Teacher'), CreateSchedule);
    app.put('/schedule/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateSchedule);
    app.delete('/schedule/delete/:id', AccessToken, Authorize('Admin', 'Teacher'), DeleteSchedule);
}

module.exports = ScheduleController;
