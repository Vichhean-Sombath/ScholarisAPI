const mongoose = require('mongoose');

const GradingCriteriaSchema = new mongoose.Schema(
    {
        criteria_id: {
            type: Number,
            unique: true
        },
        subject_id: {
            type: Number
        },
        class_id: {
            type: Number
        },
        component_name: {
            type: String,
            required: true
        },
        weight_percentage: {
            type: Number,
            required: true
        },
        attempt_count: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        collection: 'grading_criteria',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('GradingCriteria', GradingCriteriaSchema);
