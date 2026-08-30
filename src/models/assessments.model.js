const mongoose = require('mongoose');

const AssessmentsSchema = new mongoose.Schema(
    {
        assessment_id: {
            type: Number,
            unique: true
        },
        schedule_id: {
            type: Number,
            required: true
        },
        criteria_id: {
            type: Number,
            required: true
        },
        assessment_name: {
            type: String,
            required: true
        },
        max_score: {
            type: Number,
            required: true
        },
        assessment_date: {
            type: Date
        }
    },
    {
        collection: 'assessments',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('Assessments', AssessmentsSchema);
