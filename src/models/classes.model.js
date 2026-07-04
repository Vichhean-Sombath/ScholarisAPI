const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Classes = sequelize.define(
    'Classes',
    {
        classID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        classCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        className: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: 'classes',
        timestamps: true
    }
);

module.exports = Classes;