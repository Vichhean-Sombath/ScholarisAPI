const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notifications = sequelize.define(
    'Notifications',
    {
        notificationID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userID'
            }
        },
        notificationChannel: {
            type: DataTypes.ENUM('Email', 'Telegram'),
            defaultValue: 'Email',
            allowNull: false
        },
        notificationSubject: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        notificationMessage: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        notificationStatus: {
            type: DataTypes.ENUM('Pending', 'Sent', 'Failed'),
            defaultValue: 'Pending',
            allowNull: false
        },
        notificationSentAt: {
            type: DataTypes.DATE
        }
    },
    {
        tableName: 'notifications',
        timestamps: true
    }
)

module.exports = Notifications;