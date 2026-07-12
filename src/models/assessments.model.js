const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assessments = sequelize.define(
    'Assessments',
    {
        assessment_id: {
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
        criteria_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'grading_criteria',
                key: 'criteria_id'
            }
        },
        assessment_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        max_score: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: false
        },
        assessment_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'assessments',
        timestamps: false,
        indexes: [
            {
                name: 'idx_assessments_schedule',
                fields: ['schedule_id']
            },
            {
                name: 'idx_assessments_criteria',
                fields: ['criteria_id']
            }
        ]
    }
);

module.exports = Assessments;
