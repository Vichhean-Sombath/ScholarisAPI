const mongoose = require('mongoose');

const BakongQRRequestsSchema = new mongoose.Schema(
    {
        qr_id: {
            type: Number,
            unique: true
        },
        invoice_id: {
            type: Number,
            required: true
        },
        md5: {
            type: String,
            required: true,
            unique: true
        },
        amount_khr: {
            type: Number,
            required: true
        },
        amount_usd: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Expired', 'Failed'],
            required: true,
            default: 'Pending'
        },
        expires_at: {
            type: Date,
            required: true
        },
        paid_at: {
            type: Date
        }
    },
    {
        collection: 'bakong_qr_requests',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: false
        }
    }
);

module.exports = mongoose.model('BakongQRRequests', BakongQRRequestsSchema);
