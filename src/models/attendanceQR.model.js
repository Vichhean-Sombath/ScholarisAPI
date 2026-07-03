const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AttendanceQR = sequelize.define(
    'AttendanceQR',
    {
        qrID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        classSubjectID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'class_subject',
                key: 'classSubjectID'
            }
        },
        teacherID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'teacherID'
            }
        },
        qrToken: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        attendanceDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        validFrom: {
            type: DataTypes.DATE,
            allowNull: false
        },
        validUntil: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        tableName: 'attendance_qr',
        timestamps: true
    }
);

module.exports = AttendanceQR;