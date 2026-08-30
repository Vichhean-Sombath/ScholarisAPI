const mongoose = require('mongoose');

const GradesSchema = new mongoose.Schema(
    {
        grade_id: {
            type: Number,
            unique: true
        },
        assessment_id: {
            type: Number,
            required: true
        },
        student_id: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        entered_by: {
            type: Number,
            required: true
        },
        entered_at: {
            type: Date,
            required: true,
            default: Date.now
        },
        is_published: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        collection: 'grades',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('Grades', GradesSchema);
