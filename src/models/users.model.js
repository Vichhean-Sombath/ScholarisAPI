const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Users = sequelize.define(
    'Users',
    {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userFirstName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userLastName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        userRole: {
            type: DataTypes.ENUM('admin', 'teacher', 'student'),
            defaultValue: 'student',
            allowNull: false
        },
        userEmail: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        userPassword: {
            type: DataTypes.STRING(300),
            allowNull: false,
            validate: {
                len: [8, 300]
            }
        },
        userAddress: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        userDOB: {
            type: DataTypes.DATE,
            allowNull: false
        },

        userGender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
            defaultValue: 'Other'
        },
        isActive: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        }
    },
    {
        tableName: 'users',
        timestamps: true
    }
);

module.exports = Users;