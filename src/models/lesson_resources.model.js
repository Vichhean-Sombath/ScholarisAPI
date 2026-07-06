const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LessonResources = sequelize.define(
    'LessonResources',
    {
        resource_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'schedules',
                key: 'schedule_id'
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
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resource_type: {
            type: DataTypes.ENUM('LessonPlan', 'Homework', 'Syllabus', 'Other'),
            allowNull: false
        },
        file_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        upload_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'lesson_resources',
        timestamps: false,
        indexes: [
            {
                name: 'idx_lesson_resources_schedule',
                fields: ['schedule_id']
            },
            {
                name: 'idx_lesson_resources_teacher',
                fields: ['teacher_id']
            }
        ]
    }
);

module.exports = LessonResources;
