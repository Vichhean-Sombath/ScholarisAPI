const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Certificates = sequelize.define(
    'Certificates',
    {
        certificate_id: {
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
        certificate_type: {
            type: DataTypes.ENUM('Completion', 'Transcript', 'Recommendation'),
            allowNull: false
        },
        template_used: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        issue_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        generated_file_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        issued_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        }
    },
    {
        tableName: 'certificates',
        timestamps: false,
        indexes: [
            {
                name: 'idx_certificates_student',
                fields: ['student_id']
            },
            {
                name: 'idx_certificates_issued_by',
                fields: ['issued_by']
            }
        ]
    }
);

module.exports = Certificates;
