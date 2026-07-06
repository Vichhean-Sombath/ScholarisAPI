const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subjects = sequelize.define(
    'Subjects',
    {
        subject_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subject_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        subject_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        prerequisite_subject_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'subjects',
                key: 'subject_id'
            }
        }
    },
    {
        tableName: 'subjects',
        timestamps: false,
        indexes: [
            {
                name: 'idx_subjects_prerequisite',
                fields: ['prerequisite_subject_id']
            }
        ]
    }
);

module.exports = Subjects;
