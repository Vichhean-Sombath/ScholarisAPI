const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeeStructures = sequelize.define(
    'FeeStructures',
    {
        fee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        semester_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'semesters',
                key: 'semester_id'
            }
        },
        fee_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'fee_structures',
        timestamps: false,
        indexes: [
            {
                name: 'idx_fee_structures_class',
                fields: ['class_id']
            },
            {
                name: 'idx_fee_structures_semester',
                fields: ['semester_id']
            }
        ]
    }
);

module.exports = FeeStructures;
