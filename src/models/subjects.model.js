const mongoose = require('mongoose');

const SubjectsSchema = new mongoose.Schema(
    {
        subject_id: {
            type: Number,
            unique: true
        },
        subject_code: {
            type: String,
            required: true,
            unique: true
        },
        subject_name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        prerequisite_subject_id: {
            type: Number
        }
    },
    {
        collection: 'subjects',
        timestamps: false
    }
);

module.exports = mongoose.model('Subjects', SubjectsSchema);
