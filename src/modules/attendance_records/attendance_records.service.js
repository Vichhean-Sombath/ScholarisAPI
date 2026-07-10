const AttendanceRecords = require('../../models/attendance_records.model');
const Students = require('../../models/students.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetAttendanceRecordData = async (currentUser) => {
    const scheduleWhere = currentUser.role === 'Teacher'
        ? { teacher_id: currentUser.teacher_id }
        : {};

    return await AttendanceRecords.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'class_id', 'subject_id', 'time_slot_id'],
                where: scheduleWhere
            },
            { model: Teachers, as: 'Marker', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const SelectedAttendanceRecordData = async (data, currentUser) => {
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
            {
                model: Schedules,
                attributes: ['schedule_id', 'class_id', 'subject_id', 'time_slot_id', 'teacher_id']
            },
            { model: Teachers, as: 'Marker', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });

    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedRecord.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return selectedRecord;
};

const CreateAttendanceRecordData = async (recordData, currentUser) => {
    const { schedule_id, student_id, attendance_date, status } = recordData;
    const marked_by = currentUser.role === 'Teacher'
        ? currentUser.teacher_id
        : recordData.marked_by;

    const schedule = await Schedules.findByPk(schedule_id);
    if (!schedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
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

const UpdateAttendanceRecordData = async (attendance_id, recordData, currentUser) => {
    const selectedRecord = await AttendanceRecords.findByPk(attendance_id, {
        include: [{ model: Schedules, attributes: ['teacher_id'] }]
    });
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedRecord.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.role === 'Teacher' && recordData.marked_by && parseInt(recordData.marked_by) !== currentUser.teacher_id) {
        const err = new Error('Cannot mark attendance for another teacher!');
        err.statusCode = 403;
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

const DeleteAttendanceRecordData = async (attendance_id, currentUser) => {
    const selectedRecord = await AttendanceRecords.findByPk(attendance_id, {
        include: [{ model: Schedules, attributes: ['teacher_id'] }]
    });
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedRecord.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
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
