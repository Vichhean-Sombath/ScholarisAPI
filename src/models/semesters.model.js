const mongoose = require('mongoose');

const SemestersSchema = new mongoose.Schema(
    {
        semester_id: {
            type: Number,
            unique: true
        },
        academic_year_id: {
            type: Number,
            required: true
        },
        semester_name: {
            type: String,
            required: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        }
    },
    {
        collection: 'semesters',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('Semesters', SemestersSchema);
