const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reports = sequelize.define(
    'Reports',
    {
        reportID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'studentID'
            }
        },
        classSubjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'class_subject',
                key: 'classSubjectID'
            }
        },
        reportSubject: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        reportMessage: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'reports',
        timestamps: true
    }
);

module.exports = Reports;