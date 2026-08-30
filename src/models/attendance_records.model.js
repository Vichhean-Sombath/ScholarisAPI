const mongoose = require('mongoose');

const AttendanceRecordsSchema = new mongoose.Schema(
    {
        attendance_id: {
            type: Number,
            unique: true
        },
        schedule_id: {
            type: Number,
            required: true
        },
        student_id: {
            type: Number,
            required: true
        },
        attendance_date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused'],
            required: true
        },
        marked_by: {
            type: Number,
            required: true
        },
        marked_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        last_edited_at: {
            type: Date
        }
    },
    {
        collection: 'attendance_records',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('AttendanceRecords', AttendanceRecordsSchema);
