const mongoose = require('mongoose');

const TeachersSchema = new mongoose.Schema(
    {
        teacher_id: {
            type: Number,
            unique: true
        },
        user_id: {
            type: Number,
            required: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        dob: {
            type: Date
        },
        photo_url: {
            type: String
        },
        contact_number: {
            type: String
        },
        specialization: {
            type: String
        },
        bio: {
            type: String
        },
        hire_date: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            required: true,
            default: 'Active'
        }
    },
    {
        collection: 'teachers',
        timestamps: false
    }
);

module.exports = mongoose.model('Teachers', TeachersSchema);
