const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GradingCriteria = sequelize.define(
    'GradingCriteria',
    {
        criteria_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'subject_id'
            }
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        component_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        weight_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    },
    {
        tableName: 'grading_criteria',
        timestamps: false,
        indexes: [
            {
                name: 'idx_criteria_subject',
                fields: ['subject_id']
            },
            {
                name: 'idx_criteria_class',
                fields: ['class_id']
            }
        ]
    }
);

module.exports = GradingCriteria;
