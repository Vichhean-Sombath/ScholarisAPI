const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Semesters = sequelize.define(
    'Semesters',
    {
        semester_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        academic_year_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'academic_years',
                key: 'academic_year_id'
            }
        },
        semester_name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'semesters',
        timestamps: false,
        indexes: [
            {
                name: 'idx_semesters_year',
                fields: ['academic_year_id']
            }
        ]
    }
);

module.exports = Semesters;
