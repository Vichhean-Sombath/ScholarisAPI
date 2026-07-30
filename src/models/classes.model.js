const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Classes = sequelize.define(
    'Classes',
    {
        class_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        class_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        academic_year_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'academic_years',
                key: 'academic_year_id'
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
        room_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        max_capacity: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        homeroom_teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'teachers',
                key: 'teacher_id'
            }
        }
    },
    {
        tableName: 'classes',
        timestamps: false,
        indexes: [
            {
                name: 'idx_classes_year',
                fields: ['academic_year_id']
            },
            {
                name: 'idx_classes_semester',
                fields: ['semester_id']
            },
            {
                name: 'idx_classes_homeroom',
                fields: ['homeroom_teacher_id']
            }
        ]
    }
);

module.exports = Classes;
