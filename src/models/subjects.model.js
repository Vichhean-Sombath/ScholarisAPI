const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subjects = sequelize.define(
    'Subjects',
    {
        subjectID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subjectCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        subjectName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: 'subjects',
        timestamps: true
    }
);

module.exports = Subjects;