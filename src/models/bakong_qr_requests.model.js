const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BakongQRRequests = sequelize.define(
    'BakongQRRequests',
    {
        qr_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        invoice_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'invoices',
                key: 'invoice_id'
            }
        },
        md5: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
        },
        amount_khr: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false
        },
        amount_usd: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Paid', 'Expired', 'Failed'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        paid_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'bakong_qr_requests',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                name: 'idx_bakong_qr_invoice',
                fields: ['invoice_id']
            },
            {
                name: 'idx_bakong_qr_md5',
                fields: ['md5']
            },
            {
                name: 'idx_bakong_qr_status',
                fields: ['status']
            }
        ]
    }
);

module.exports = BakongQRRequests;
