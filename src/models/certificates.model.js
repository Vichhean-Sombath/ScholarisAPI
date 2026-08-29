const mongoose = require('mongoose');

const CertificatesSchema = new mongoose.Schema(
    {
        certificate_id: {
            type: Number,
            unique: true
        },
        student_id: {
            type: Number,
            required: true
        },
        certificate_type: {
            type: String,
            enum: ['Completion', 'Transcript', 'Recommendation'],
            required: true
        },
        template_used: {
            type: String
        },
        issue_date: {
            type: Date,
            required: true
        },
        generated_file_url: {
            type: String
        },
        issued_by: {
            type: Number,
            required: true
        }
    },
    {
        collection: 'certificates',
        timestamps: false
    }
);

module.exports = mongoose.model('Certificates', CertificatesSchema);
