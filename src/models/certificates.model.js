const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certificates = sequelize.define(
    'Certificates',
    {
        certificateID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        studentID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'studentID'
            },
        },
        certificateType: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        certificateIssuedDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        certificateURL: {
            type: DataTypes.STRING(400),
            allowNull: false
        }
    },
    {
        tableName: 'certificates',
        timestamps: true
    }
);

module.exports = Certificates;