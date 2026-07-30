const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AttendanceRecords = sequelize.define(
    'AttendanceRecords',
    {
        attendance_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'schedules',
                key: 'schedule_id'
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
        attendance_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused'),
            allowNull: false
        },
        marked_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'teacher_id'
            }
        },
        marked_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        last_edited_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'attendance_records',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['schedule_id', 'student_id', 'attendance_date']
            },
            {
                name: 'idx_attendance_student',
                fields: ['student_id']
            },
            {
                name: 'idx_attendance_marked_by',
                fields: ['marked_by']
            },
            {
                name: 'idx_attendance_date',
                fields: ['attendance_date']
            }
        ]
    }
);

module.exports = AttendanceRecords;
