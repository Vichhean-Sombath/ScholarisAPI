const Schedules = require('../../models/schedules.model');
const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const Teachers = require('../../models/teachers.model');
const TimeSlots = require('../../models/time_slots.model');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'class', select: 'class_id class_name' },
    { path: 'subject', select: 'subject_id subject_code subject_name' },
    { path: 'teacher', select: 'teacher_id first_name last_name' },
    { path: 'timeSlot', select: 'time_slot_id day_of_week start_time end_time' }
];

const GetScheduleData = async (currentUser) => {
    const query = currentUser.role === 'Teacher'
        ? { teacher_id: currentUser.teacher_id }
        : {};

    return await Schedules.find(query).populate(sharedPopulates);
};

const SelectedScheduleData = async (data, currentUser) => {
    const selectedSchedule = await Schedules.findOne({ schedule_id: data }).populate(sharedPopulates);

    if (!selectedSchedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedSchedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return selectedSchedule;
};

const CreateScheduleData = async (scheduleData, currentUser) => {
    const { class_id, subject_id, time_slot_id, room_number } = scheduleData;
    const teacher_id = currentUser.role === 'Teacher'
        ? currentUser.teacher_id
        : scheduleData.teacher_id;

    const relatedClass = await Classes.findOne({ class_id });
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedSubject = await Subjects.findOne({ subject_id });
    if (!relatedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTeacher = await Teachers.findOne({ teacher_id });
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTimeSlot = await TimeSlots.findOne({ time_slot_id });
    if (!relatedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedTeacherSchedule = await Schedules.findOne({
        teacher_id, time_slot_id
    });
    if (existedTeacherSchedule) {
        const err = new Error('Teacher is already assigned to another schedule at this time slot!');
        err.statusCode = 400;
        throw err;
    }

    let schedule_id = scheduleData.schedule_id;
    if (!schedule_id) {
        const lastSch = await Schedules.findOne().sort({ schedule_id: -1 });
        schedule_id = lastSch ? lastSch.schedule_id + 1 : 1;
    }

    const createSchedule = await Schedules.create({
        schedule_id,
        class_id,
        subject_id,
        teacher_id,
        time_slot_id,
        room_number: room_number || relatedClass.room_number || null
    });

    return await Schedules.findOne({ schedule_id: createSchedule.schedule_id }).populate(sharedPopulates);
};

const UpdateScheduleData = async (schedule_id, scheduleData, currentUser) => {
    const selectedSchedule = await Schedules.findOne({ schedule_id });
    if (!selectedSchedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedSchedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.role === 'Teacher' && scheduleData.teacher_id && parseInt(scheduleData.teacher_id) !== currentUser.teacher_id) {
        const err = new Error('Cannot assign schedule to another teacher!');
        err.statusCode = 403;
        throw err;
    }

    const newClassId = scheduleData.class_id || selectedSchedule.class_id;
    const newSubjectId = scheduleData.subject_id || selectedSchedule.subject_id;
    const newTeacherId = scheduleData.teacher_id || selectedSchedule.teacher_id;
    const newTimeSlotId = scheduleData.time_slot_id || selectedSchedule.time_slot_id;

    const relatedClass = await Classes.findOne({ class_id: newClassId });
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedSubject = await Subjects.findOne({ subject_id: newSubjectId });
    if (!relatedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTeacher = await Teachers.findOne({ teacher_id: newTeacherId });
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTimeSlot = await TimeSlots.findOne({ time_slot_id: newTimeSlotId });
    if (!relatedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    if ((scheduleData.teacher_id && parseInt(scheduleData.teacher_id) !== parseInt(selectedSchedule.teacher_id)) ||
        (scheduleData.time_slot_id && parseInt(scheduleData.time_slot_id) !== parseInt(selectedSchedule.time_slot_id))) {
        const existedTeacherSchedule = await Schedules.findOne({
            teacher_id: newTeacherId,
            time_slot_id: newTimeSlotId,
            schedule_id: { $ne: schedule_id }
        });
        if (existedTeacherSchedule) {
            const err = new Error('Teacher is already assigned to another schedule at this time slot!');
            err.statusCode = 400;
            throw err;
        }
    }

    Object.assign(selectedSchedule, {
        ...scheduleData,
        room_number: scheduleData.room_number || relatedClass.room_number || null
    });
    await selectedSchedule.save();

    return await Schedules.findOne({ schedule_id }).populate(sharedPopulates);
};

const DeleteScheduleData = async (schedule_id, currentUser) => {
    const selectedSchedule = await Schedules.findOne({ schedule_id });
    if (!selectedSchedule) {
        const err = new Error('Schedule not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedSchedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await Schedules.deleteOne({ schedule_id });
};

module.exports = {
    GetScheduleData,
    SelectedScheduleData,
    CreateScheduleData,
    UpdateScheduleData,
    DeleteScheduleData
};
