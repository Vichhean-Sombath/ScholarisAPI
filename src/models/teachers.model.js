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
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        photo_url: {
            type: String
        },
        contact_number: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        bio: {
            type: String
        },
        hire_date: {
            type: Date,
            required: true
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
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('Teachers', TeachersSchema);
