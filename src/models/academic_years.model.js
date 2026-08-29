const mongoose = require('mongoose');

const AcademicYearsSchema = new mongoose.Schema(
    {
        academic_year_id: {
            type: Number,
            unique: true
        },
        year_name: {
            type: String,
            required: true,
            unique: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Closed'],
            required: true,
            default: 'Active'
        }
    },
    {
        collection: 'academic_years',
        timestamps: false
    }
);

module.exports = mongoose.model('AcademicYears', AcademicYearsSchema);
