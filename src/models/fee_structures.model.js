const mongoose = require('mongoose');

const FeeStructuresSchema = new mongoose.Schema(
    {
        fee_id: {
            type: Number,
            unique: true
        },
        class_id: {
            type: Number
        },
        semester_id: {
            type: Number,
            required: true
        },
        fee_name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        due_date: {
            type: Date
        }
    },
    {
        collection: 'fee_structures',
        timestamps: false
    }
);

module.exports = mongoose.model('FeeStructures', FeeStructuresSchema);
