const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentTransactions = sequelize.define(
    'PaymentTransactions',
    {
        paymentTransactionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        paymentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'payments',
                key: 'paymentID'
            }
        },
        paymentTransactionAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentTransactionDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        paymentTransactionStatus: {
            type: DataTypes.ENUM('Pending', 'Success', 'Failed'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        paymentTransactionReference: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true
        },
        paymentMethod: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        tableName: 'payment_transactions',
        timestamps: true
    }
);

module.exports = PaymentTransactions;
