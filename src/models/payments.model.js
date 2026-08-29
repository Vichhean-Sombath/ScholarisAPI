const mongoose = require('mongoose');

const PaymentsSchema = new mongoose.Schema(
    {
        payment_id: {
            type: Number,
            unique: true
        },
        invoice_id: {
            type: Number,
            required: true
        },
        payment_date: {
            type: Date,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        payment_method: {
            type: String,
            enum: ['Stripe', 'BakongKHQR'],
            required: true
        },
        receipt_url: {
            type: String
        },
        transaction_reference: {
            type: String
        },
        recorded_by: {
            type: Number,
            required: true
        },
        notes: {
            type: String
        }
    },
    {
        collection: 'payments',
        timestamps: false
    }
);

module.exports = mongoose.model('Payments', PaymentsSchema);
