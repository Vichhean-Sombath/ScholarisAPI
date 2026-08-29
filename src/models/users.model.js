const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password_hash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['Admin', 'Teacher', 'Student'],
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            required: true,
            default: 'Active'
        },
        last_login_at: {
            type: Date
        }
    },
    {
        collection: 'users',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

module.exports = mongoose.model('Users', UsersSchema);
