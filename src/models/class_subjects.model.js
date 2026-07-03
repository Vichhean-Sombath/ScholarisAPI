const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClassSubject = sequelize.define(
    'ClassSubject',
    {
        classSubjectID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        classID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'classID'
            }
        },

        subjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'subjectID'
            }
        }
    },
    {
        tableName: 'class_subject',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['classID', 'subjectID']
            }
        ]
    }
);

module.exports = ClassSubject;