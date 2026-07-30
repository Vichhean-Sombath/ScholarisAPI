const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AcademicYears = sequelize.define(
    'AcademicYears',
    {
        academic_year_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        year_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Closed'),
            allowNull: false,
            defaultValue: 'Active'
        }
    },
    {
        tableName: 'academic_years',
        timestamps: false
    }
);

module.exports = AcademicYears;
