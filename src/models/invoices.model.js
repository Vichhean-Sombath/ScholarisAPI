const mongoose = require('mongoose');

const InvoicesSchema = new mongoose.Schema(
    {
        invoice_id: {
            type: Number,
            unique: true
        },
        invoice_number: {
            type: String,
            required: true,
            unique: true
        },
        student_id: {
            type: Number,
            required: true
        },
        fee_id: {
            type: Number,
            required: true
        },
        semester_id: {
            type: Number,
            required: true
        },
        issue_date: {
            type: Date,
            required: true
        },
        due_date: {
            type: Date,
            required: true
        },
        total_amount: {
            type: Number,
            required: true
        },
        amount_paid: {
            type: Number,
            required: true,
            default: 0
        },
        status: {
            type: String,
            enum: ['Unpaid', 'Partial', 'Paid', 'Overdue'],
            required: true,
            default: 'Unpaid'
        }
    },
    {
        collection: 'invoices',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: false
        }
    }
);

module.exports = mongoose.model('Invoices', InvoicesSchema);
