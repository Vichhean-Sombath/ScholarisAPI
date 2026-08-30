const mongoose = require('mongoose');

const FinalGradesSchema = new mongoose.Schema(
    {
        final_grade_id: {
            type: Number,
            unique: true
        },
        student_id: {
            type: Number,
            required: true
        },
        subject_id: {
            type: Number,
            required: true
        },
        class_id: {
            type: Number,
            required: true
        },
        semester_id: {
            type: Number,
            required: true
        },
        final_score: {
            type: Number,
            required: true
        },
        letter_grade: {
            type: String
        },
        gpa_points: {
            type: Number
        },
        computed_at: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        collection: 'final_grades',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('FinalGrades', FinalGradesSchema);
