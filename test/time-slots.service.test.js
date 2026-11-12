const test = require('node:test');
const assert = require('node:assert/strict');

const TimeSlots = require('../src/models/time_slots.model');
const {
    CreateTimeSlotData,
    UpdateTimeSlotData
} = require('../src/modules/time_slots/time_slots.service');

test('time-slot service rejects durations shorter than ninety minutes', async () => {
    const originalFindOne = TimeSlots.findOne;

    try {
        await assert.rejects(
            CreateTimeSlotData({
                day_of_week: 'Mon',
                start_time: '08:00',
                end_time: '09:29'
            }),
            (error) => error.statusCode === 400
                && error.message === 'Time slot must be at least 1 hour 30 minutes long!'
        );

        TimeSlots.findOne = async () => ({
            time_slot_id: 1,
            day_of_week: 'Mon',
            start_time: '08:00',
            end_time: '10:00',
            save: async () => {}
        });

        await assert.rejects(
            UpdateTimeSlotData(1, { end_time: '09:29' }),
            (error) => error.statusCode === 400
                && error.message === 'Time slot must be at least 1 hour 30 minutes long!'
        );
    } finally {
        TimeSlots.findOne = originalFindOne;
    }
});
