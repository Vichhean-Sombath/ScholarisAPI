const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema(
    {
        student_id: {
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
        dob: {
            type: Date
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        photo_url: {
            type: String
        },
        contact_number: {
            type: String
        },
        address: {
            type: String
        },
        enrollment_date: {
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
        collection: 'students',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: false
        }
    }
);

module.exports = mongoose.model('Students', StudentsSchema);
