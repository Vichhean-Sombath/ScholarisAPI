const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define(
    'Attendance',
    {
        attendanceID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
        attendanceDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        attendanceStatus: {
            type: DataTypes.ENUM('present', 'absent', 'late'),
            allowNull: false,
            defaultValue: 'absent'
        },
        attendanceCheckType: {
            type: DataTypes.ENUM('Teacher', 'AttendanceQR'),
            defaultValue: 'Teacher',
            allowNull: false
        }
    },
    {
        tableName: 'attendance',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['studentID', 'classSubjectID', 'attendanceDate']
            }
        ]
    }
);

module.exports = Attendance;