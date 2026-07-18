const Schedules = require('../../models/schedules.model');
const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const Teachers = require('../../models/teachers.model');
const TimeSlots = require('../../models/time_slots.model');
const { Op } = require('sequelize');

const GetScheduleData = async (currentUser) => {
    const where = currentUser.role === 'Teacher'
        ? { teacher_id: currentUser.teacher_id }
        : {};

    return await Schedules.findAll({
        where,
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
        ]
    });
};

const SelectedScheduleData = async (data, currentUser) => {
    const selectedSchedule = await Schedules.findByPk(data, {
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
        ]
    });

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

    const relatedClass = await Classes.findByPk(class_id);
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedSubject = await Subjects.findByPk(subject_id);
    if (!relatedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTeacher = await Teachers.findByPk(teacher_id);
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTimeSlot = await TimeSlots.findByPk(time_slot_id);
    if (!relatedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedTeacherSchedule = await Schedules.findOne({
        where: { teacher_id, time_slot_id }
    });
    if (existedTeacherSchedule) {
        const err = new Error('Teacher is already assigned to another schedule at this time slot!');
        err.statusCode = 400;
        throw err;
    }

    const createSchedule = await Schedules.create({
        class_id,
        subject_id,
        teacher_id,
        time_slot_id,
        room_number: room_number || relatedClass.room_number || null
    });

    return await Schedules.findByPk(createSchedule.schedule_id, {
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
        ]
    });
};

const UpdateScheduleData = async (schedule_id, scheduleData, currentUser) => {
    const selectedSchedule = await Schedules.findByPk(schedule_id);
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

    const relatedClass = await Classes.findByPk(newClassId);
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedSubject = await Subjects.findByPk(newSubjectId);
    if (!relatedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTeacher = await Teachers.findByPk(newTeacherId);
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedTimeSlot = await TimeSlots.findByPk(newTimeSlotId);
    if (!relatedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    if ((scheduleData.teacher_id && parseInt(scheduleData.teacher_id) !== parseInt(selectedSchedule.teacher_id)) ||
        (scheduleData.time_slot_id && parseInt(scheduleData.time_slot_id) !== parseInt(selectedSchedule.time_slot_id))) {
        const existedTeacherSchedule = await Schedules.findOne({
            where: {
                teacher_id: newTeacherId,
                time_slot_id: newTimeSlotId,
                schedule_id: { [Op.ne]: schedule_id }
            }
        });
        if (existedTeacherSchedule) {
            const err = new Error('Teacher is already assigned to another schedule at this time slot!');
            err.statusCode = 400;
            throw err;
        }
    }

    await selectedSchedule.update({
        ...scheduleData,
        room_number: scheduleData.room_number || relatedClass.room_number || null
    });

    return await Schedules.findByPk(schedule_id, {
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
        ]
    });
};

const DeleteScheduleData = async (schedule_id, currentUser) => {
    const selectedSchedule = await Schedules.findByPk(schedule_id);
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

    await selectedSchedule.destroy();
};

module.exports = {
    GetScheduleData,
    SelectedScheduleData,
    CreateScheduleData,
    UpdateScheduleData,
    DeleteScheduleData
};
