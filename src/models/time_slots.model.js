const mongoose = require('mongoose');

const TimeSlotsSchema = new mongoose.Schema(
    {
        time_slot_id: {
            type: Number,
            unique: true
        },
        day_of_week: {
            type: String,
            enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            required: true
        },
        start_time: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        }
    },
    {
        collection: 'time_slots',
        timestamps: false
    }
);

module.exports = mongoose.model('TimeSlots', TimeSlotsSchema);
