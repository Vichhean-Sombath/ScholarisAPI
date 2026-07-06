const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const StudentEmergencyContacts = sequelize.define(
    'StudentEmergencyContacts',
    {
        contact_id: {
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
        contact_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        relationship: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    },
    {
        tableName: 'student_emergency_contacts',
        timestamps: false,
        indexes: [
            {
                name: 'idx_sec_student',
                fields: ['student_id']
            }
        ]
    }
);

module.exports = StudentEmergencyContacts;
