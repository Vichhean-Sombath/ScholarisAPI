const mongoose = require('mongoose');

const ClassEnrollmentsSchema = new mongoose.Schema(
    {
        enrollment_id: {
            type: Number,
            unique: true
        },
        student_id: {
            type: Number,
            required: true
        },
        class_id: {
            type: Number,
            required: true
        },
        enrollment_date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Transferred', 'Withdrawn'],
            required: true,
            default: 'Active'
        }
    },
    {
        collection: 'class_enrollments',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('ClassEnrollments', ClassEnrollmentsSchema);
