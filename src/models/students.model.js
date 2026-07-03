const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Students = sequelize.define(
    'Students',
    {
        studentID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'users',
                key: 'userID'
            }
        },
        studentNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },

        enrollmentDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'students',
        timestamps: true
    }
);

module.exports = Students;