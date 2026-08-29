const mongoose = require('mongoose');

const ClassesSchema = new mongoose.Schema(
    {
        class_id: {
            type: Number,
            unique: true
        },
        class_name: {
            type: String,
            required: true
        },
        academic_year_id: {
            type: Number,
            required: true
        },
        semester_id: {
            type: Number,
            required: true
        },
        room_number: {
            type: String
        },
        max_capacity: {
            type: Number
        },
        homeroom_teacher_id: {
            type: Number
        }
    },
    {
        collection: 'classes',
        timestamps: false
    }
);

module.exports = mongoose.model('Classes', ClassesSchema);
