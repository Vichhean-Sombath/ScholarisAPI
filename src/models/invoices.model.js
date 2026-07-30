const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoices = sequelize.define(
    'Invoices',
    {
        invoice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        invoice_number: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'student_id'
            }
        },
        fee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fee_structures',
                key: 'fee_id'
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
        issue_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        amount_paid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('Unpaid', 'Partial', 'Paid', 'Overdue'),
            allowNull: false,
            defaultValue: 'Unpaid'
        }
    },
    {
        tableName: 'invoices',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                name: 'idx_invoices_student',
                fields: ['student_id']
            },
            {
                name: 'idx_invoices_fee',
                fields: ['fee_id']
            },
            {
                name: 'idx_invoices_semester',
                fields: ['semester_id']
            }
        ]
    }
);

module.exports = Invoices;
