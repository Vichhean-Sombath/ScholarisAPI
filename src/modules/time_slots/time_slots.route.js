const AccessToken = require('../../middleware/authenticate');
const { GetTimeSlot, SelectTimeSlot, CreateTimeSlot, UpdateTimeSlot, DeleteTimeSlot } = require('./time_slots.controller');

const TimeSlotController = app => {
    app.get('/time-slot/data', AccessToken, GetTimeSlot);
    app.get('/time-slot/data/:id', AccessToken, SelectTimeSlot);
    app.post('/time-slot/create', AccessToken, CreateTimeSlot);
    app.put('/time-slot/update/:id', AccessToken, UpdateTimeSlot);
    app.delete('/time-slot/delete/:id', AccessToken, DeleteTimeSlot);
}

module.exports = TimeSlotController;
