const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedules = sequelize.define(
    'Schedules',
    {
        schedule_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'classes',
                key: 'class_id'
            }
        },
        subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'subjects',
                key: 'subject_id'
            }
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'teachers',
                key: 'teacher_id'
            }
        },
        time_slot_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'time_slots',
                key: 'time_slot_id'
            }
        },
        room_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    },
    {
        tableName: 'schedules',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['teacher_id', 'time_slot_id']
            },
            {
                name: 'idx_schedules_class',
                fields: ['class_id']
            },
            {
                name: 'idx_schedules_subject',
                fields: ['subject_id']
            },
            {
                name: 'idx_schedules_teacher',
                fields: ['teacher_id']
            },
            {
                name: 'idx_schedules_time_slot',
                fields: ['time_slot_id']
            }
        ]
    }
);

module.exports = Schedules;
