const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Teachers = sequelize.define(
    'Teachers',
    {
        teacherID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        teacherNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        teacherPosition: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        hireDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isActive: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        }
    },
    {
        tableName: 'teachers',
        timestamps: true
    }
);

module.exports = Teachers;