const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetTimeSlot, SelectTimeSlot, CreateTimeSlot, UpdateTimeSlot, DeleteTimeSlot } = require('./time_slots.controller');

const TimeSlotController = app => {
    app.get('/time-slot/data', AccessToken, Authorize('Admin', 'Teacher'), GetTimeSlot);
    app.get('/time-slot/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectTimeSlot);
    app.post('/time-slot/create', AccessToken, Authorize('Admin'), CreateTimeSlot);
    app.put('/time-slot/update/:id', AccessToken, Authorize('Admin'), UpdateTimeSlot);
    app.delete('/time-slot/delete/:id', AccessToken, Authorize('Admin'), DeleteTimeSlot);
}

module.exports = TimeSlotController;
