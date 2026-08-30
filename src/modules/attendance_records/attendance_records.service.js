const AttendanceRecords = require('../../models/attendance_records.model');
const Students = require('../../models/students.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');

const getPopulates = (currentUser) => {
    const scheduleMatch = currentUser.role === 'Teacher' ? { teacher_id: currentUser.teacher_id } : {};
    return [
        { path: 'student', select: 'student_id first_name last_name' },
        { path: 'schedule', select: 'schedule_id class_id subject_id time_slot_id teacher_id', match: scheduleMatch },
        { path: 'marker', select: 'teacher_id first_name last_name' }
    ];
};

const GetAttendanceRecordData = async (currentUser) => {
    let records = await AttendanceRecords.find().populate(getPopulates(currentUser)).lean();

    if (currentUser.role === 'Teacher') {
        records = records.filter(r => r.schedule);
    }

    return records;
};

const SelectedAttendanceRecordData = async (data, currentUser) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ attendance_id: Number(data) });
    }

    const pipeline = [
        {
            $lookup: {
                from: 'students',
                localField: 'student_id',
                foreignField: 'student_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        {
            $match: {
                $or: [
                    ...orConditions,
                    { 'student.first_name': { $regex: data, $options: 'i' } },
                    { 'student.last_name': { $regex: data, $options: 'i' } }
                ]
            }
        }
    ];

    const matched = await AttendanceRecords.aggregate(pipeline);
    if (!matched.length) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    const selectedRecord = await AttendanceRecords.findOne({ attendance_id: matched[0].attendance_id })
        .populate([
            { path: 'student', select: 'student_id first_name last_name' },
            { path: 'schedule', select: 'schedule_id class_id subject_id time_slot_id teacher_id' },
            { path: 'marker', select: 'teacher_id first_name last_name' }
        ]);

    if (currentUser.role === 'Teacher' && selectedRecord.schedule?.teacher_id !== currentUser.teacher_id) {
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

    if (currentUser.role !== 'Teacher' && (marked_by === undefined || marked_by === null)) {
        const err = new Error('Marked by (teacher ID) required for non-teacher users!');
        err.statusCode = 400;
        throw err;
    }

    const schedule = await Schedules.findOne({ schedule_id });
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

    const student = await Students.findOne({ student_id });
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const teacher = await Teachers.findOne({ teacher_id: marked_by });
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

    let attendance_id = recordData.attendance_id;
    if (!attendance_id) {
        const lastAtt = await AttendanceRecords.findOne().sort({ attendance_id: -1 });
        attendance_id = lastAtt ? lastAtt.attendance_id + 1 : 1;
    }

    const createRecord = await AttendanceRecords.create({
        attendance_id,
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
    const selectedRecord = await AttendanceRecords.findOne({ attendance_id }).populate('schedule');
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedRecord.schedule?.teacher_id !== currentUser.teacher_id) {
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
        const schedule = await Schedules.findOne({ schedule_id: recordData.schedule_id });
        if (!schedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (recordData.student_id !== undefined) {
        const student = await Students.findOne({ student_id: recordData.student_id });
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (recordData.marked_by !== undefined) {
        const teacher = await Teachers.findOne({ teacher_id: recordData.marked_by });
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

    if (recordData.status !== undefined && !['Present', 'Absent', 'Late'].includes(recordData.status)) {
        const err = new Error('Status must be Present, Absent, or Late!');
        err.statusCode = 400;
        throw err;
    }

    recordData.last_edited_at = new Date();

    Object.assign(selectedRecord, recordData);
    await selectedRecord.save();

    return selectedRecord;
};

const DeleteAttendanceRecordData = async (attendance_id, currentUser) => {
    const selectedRecord = await AttendanceRecords.findOne({ attendance_id }).populate('schedule');
    if (!selectedRecord) {
        const err = new Error('Attendance record not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedRecord.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await AttendanceRecords.deleteOne({ attendance_id });
};

module.exports = {
    GetAttendanceRecordData,
    SelectedAttendanceRecordData,
    CreateAttendanceRecordData,
    UpdateAttendanceRecordData,
    DeleteAttendanceRecordData
};
