const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Grades = sequelize.define(
    'Grades',
    {
        grade_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        assessment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'assessments',
                key: 'assessment_id'
            }
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'student_id'
            }
        },
        score: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },
        entered_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'teacher_id'
            }
        },
        entered_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: 'grades',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['assessment_id', 'student_id']
            },
            {
                name: 'idx_grades_student',
                fields: ['student_id']
            },
            {
                name: 'idx_grades_entered_by',
                fields: ['entered_by']
            }
        ]
    }
);

module.exports = Grades;
