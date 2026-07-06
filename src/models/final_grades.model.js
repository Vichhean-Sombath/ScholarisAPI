const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FinalGrades = sequelize.define(
    'FinalGrades',
    {
        final_grade_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'student_id'
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
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        semester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'semesters',
                key: 'semester_id'
            }
        },
        final_score: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },
        letter_grade: {
            type: DataTypes.STRING(2),
            allowNull: true
        },
        gpa_points: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: true
        },
        computed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'final_grades',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['student_id', 'subject_id', 'semester_id']
            },
            {
                name: 'idx_final_grades_subject',
                fields: ['subject_id']
            },
            {
                name: 'idx_final_grades_class',
                fields: ['class_id']
            },
            {
                name: 'idx_final_grades_semester',
                fields: ['semester_id']
            }
        ]
    }
);

module.exports = FinalGrades;
