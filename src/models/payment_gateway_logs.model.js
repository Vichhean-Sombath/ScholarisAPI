const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentGatewayLogs = sequelize.define(
    'PaymentGatewayLogs',
    {
        paymentGatewayID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        paymentTransactionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'payment_transactions',
                key: 'paymentTransactionID'
            }
        },
        paymentGatewayName: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        paymentGatewayRequest: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        paymentGatewayResponse: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        paymentGatewayStatus: {
            type: DataTypes.ENUM('Sent', 'Received', 'Success', 'Failed'),
            allowNull: false,
            defaultValue: 'Sent'
        },
        logTimestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'payment_gateway_logs',
        timestamps: true
    }
);

module.exports = PaymentGatewayLogs;
