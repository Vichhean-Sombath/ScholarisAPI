const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Students = sequelize.define(
    'Students',
    {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true
        },
        photo_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        contact_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        enrollment_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive'),
            allowNull: false,
            defaultValue: 'Active'
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true
        }
    },
    {
        tableName: 'students',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    }
);

module.exports = Students;
