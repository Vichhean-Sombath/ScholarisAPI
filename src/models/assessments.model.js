const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assessments = sequelize.define(
    'Assessments',
    {
        assessment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        criteria_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'grading_criteria',
                key: 'criteria_id'
            }
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'subject_id'
            }
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'teacher_id'
            }
        },
        assessment_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        max_score: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },
        assessment_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'assessments',
        timestamps: false,
        indexes: [
            {
                name: 'idx_assessments_criteria',
                fields: ['criteria_id']
            },
            {
                name: 'idx_assessments_class',
                fields: ['class_id']
            },
            {
                name: 'idx_assessments_subject',
                fields: ['subject_id']
            },
            {
                name: 'idx_assessments_teacher',
                fields: ['teacher_id']
            }
        ]
    }
);

module.exports = Assessments;
