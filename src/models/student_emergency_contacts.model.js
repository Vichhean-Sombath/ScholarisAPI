const mongoose = require('mongoose');

const StudentEmergencyContactsSchema = new mongoose.Schema(
    {
        contact_id: {
            type: Number,
            unique: true
        },
        student_id: {
            type: Number,
            required: true
        },
        contact_name: {
            type: String,
            required: true
        },
        relationship: {
            type: String
        },
        phone_number: {
            type: String,
            required: true
        },
        email: {
            type: String
        }
    },
    {
        collection: 'student_emergency_contacts',
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

module.exports = mongoose.model('StudentEmergencyContacts', StudentEmergencyContactsSchema);
