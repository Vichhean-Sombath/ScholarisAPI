const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        sequence_value: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        collection: 'counters',
        timestamps: false
    }
);

module.exports = mongoose.model('Counters', CounterSchema);
