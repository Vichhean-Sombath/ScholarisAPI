const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payments = sequelize.define(
    'Payments',
    {
        paymentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'studentID'
            }
        },
        paymentAmount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.ENUM('Pending', 'Paid'),
            defaultValue: 'Pending',
            allowNull: false
        }
    },
    {
        tableName: 'payments',
        timestamps: true
    }
);

module.exports = Payments;