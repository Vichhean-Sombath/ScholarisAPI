const mongoose = require('mongoose');

const SchedulesSchema = new mongoose.Schema(
    {
        schedule_id: {
            type: Number,
            unique: true
        },
        class_id: {
            type: Number,
            required: true
        },
        subject_id: {
            type: Number,
            required: true
        },
        teacher_id: {
            type: Number,
            required: true
        },
        time_slot_id: {
            type: Number,
            required: true
        },
        room_number: {
            type: String
        }
    },
    {
        collection: 'schedules',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('Schedules', SchedulesSchema);
