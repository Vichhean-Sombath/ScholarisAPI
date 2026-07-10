const AccessToken = require('../../middleware/authenticate');
const { GetSchedule, SelectSchedule, CreateSchedule, UpdateSchedule, DeleteSchedule } = require('./schedules.controller');

const ScheduleController = app => {
    app.get('/schedule/data', AccessToken, GetSchedule);
    app.get('/schedule/data/:id', AccessToken, SelectSchedule);
    app.post('/schedule/create', AccessToken, CreateSchedule);
    app.put('/schedule/update/:id', AccessToken, UpdateSchedule);
    app.delete('/schedule/delete/:id', AccessToken, DeleteSchedule);
}

module.exports = ScheduleController;
