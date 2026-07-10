const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payments = sequelize.define(
    'Payments',
    {
        payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'invoices',
                key: 'invoice_id'
            }
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        payment_method: {
            type: DataTypes.ENUM('Stripe', 'BakongKHQR'),
            allowNull: false
        },
        receipt_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        recorded_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        notes: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
        tableName: 'payments',
        timestamps: false,
        indexes: [
            {
                name: 'idx_payments_invoice',
                fields: ['invoice_id']
            },
            {
                name: 'idx_payments_recorded_by',
                fields: ['recorded_by']
            }
        ]
    }
);

module.exports = Payments;
