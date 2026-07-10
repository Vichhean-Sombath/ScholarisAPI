const AttendanceRecords = require('../../models/attendance_records.model');
const Students = require('../../models/students.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetAttendanceRecordData = async () => {
    return await AttendanceRecords.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Schedules, attributes: ['schedule_id', 'class_id', 'subject_id', 'time_slot_id'] },
            { model: Teachers, as: 'Marker', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const SelectedAttendanceRecordData = async (data) => {
    const selectedRecord = await AttendanceRecords.findOne({
        where: {
            [Op.or]: [
                { attendance_id: data },
                { '$Student.first_name$': { [Op.like]: `%${data}%` } },
                { '$Student.last_name$': { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Schedules, attributes: ['schedule_id', 'class_id', 'subject_id', 'time_slot_id'] },
            { model: Teachers, as: 'Marker', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });

    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedRecord;
};

const CreateAttendanceRecordData = async (recordData) => {
    const { schedule_id, student_id, attendance_date, status, marked_by } = recordData;

    const schedule = await Schedules.findByPk(schedule_id);
    if (!schedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const teacher = await Teachers.findByPk(marked_by);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if (isNaN(Date.parse(attendance_date))) {
        const err = new Error('Invalid attendance date!');
        err.statusCode = 400;
        throw err;
    }

    const createRecord = await AttendanceRecords.create({
        schedule_id,
        student_id,
        attendance_date,
        status,
        marked_by,
        marked_at: new Date()
    });

    return createRecord;
};

const UpdateAttendanceRecordData = async (attendance_id, recordData) => {
    const selectedRecord = await AttendanceRecords.findByPk(attendance_id);
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (recordData.schedule_id !== undefined) {
        const schedule = await Schedules.findByPk(recordData.schedule_id);
        if (!schedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (recordData.student_id !== undefined) {
        const student = await Students.findByPk(recordData.student_id);
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (recordData.marked_by !== undefined) {
        const teacher = await Teachers.findByPk(recordData.marked_by);
        if (!teacher) {
            const err = new Error('Teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (recordData.attendance_date !== undefined && isNaN(Date.parse(recordData.attendance_date))) {
        const err = new Error('Invalid attendance date!');
        err.statusCode = 400;
        throw err;
    }

    if (recordData.status !== undefined && !['Present', 'Absent', 'Late', 'Excused'].includes(recordData.status)) {
        const err = new Error('Status must be Present, Absent, Late, or Excused!');
        err.statusCode = 400;
        throw err;
    }

    recordData.last_edited_at = new Date();

    await selectedRecord.update(recordData);

    return selectedRecord;
};

const DeleteAttendanceRecordData = async (attendance_id) => {
    const selectedRecord = await AttendanceRecords.findByPk(attendance_id);
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedRecord.destroy();
};

module.exports = {
    GetAttendanceRecordData,
    SelectedAttendanceRecordData,
    CreateAttendanceRecordData,
    UpdateAttendanceRecordData,
    DeleteAttendanceRecordData
};
