const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClassEnrollments = sequelize.define(
    'ClassEnrollments',
    {
        enrollment_id: {
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
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        enrollment_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Active', 'Transferred', 'Withdrawn'),
            allowNull: false,
            defaultValue: 'Active'
        }
    },
    {
        tableName: 'class_enrollments',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['student_id', 'class_id', 'enrollment_date']
            },
            {
                name: 'idx_enrollments_student',
                fields: ['student_id']
            },
            {
                name: 'idx_enrollments_class',
                fields: ['class_id']
            }
        ]
    }
);

module.exports = ClassEnrollments;
