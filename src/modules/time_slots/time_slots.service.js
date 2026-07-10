const TimeSlots = require('../../models/time_slots.model');
const Schedules = require('../../models/schedules.model');
const { Op } = require('sequelize');

const GetTimeSlotData = async () => {
    return await TimeSlots.findAll({
        include: [{
            model: Schedules,
            attributes: ['schedule_id', 'class_id', 'subject_id', 'teacher_id', 'room_number']
        }]
    });
};

const SelectedTimeSlotData = async (data) => {
    const selectedTimeSlot = await TimeSlots.findByPk(data, {
        include: [{
            model: Schedules,
            attributes: ['schedule_id', 'class_id', 'subject_id', 'teacher_id', 'room_number']
        }]
    });

    if (!selectedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedTimeSlot;
};

const CreateTimeSlotData = async (timeSlotData) => {
    const { day_of_week, start_time, end_time } = timeSlotData;

    if (start_time >= end_time) {
        const err = new Error('Start time must be earlier than end time!');
        err.statusCode = 400;
        throw err;
    }

    const existedTimeSlot = await TimeSlots.findOne({
        where: { day_of_week, start_time }
    });
    if (existedTimeSlot) {
        const err = new Error('This time slot already exists!');
        err.statusCode = 400;
        throw err;
    }

    const createTimeSlot = await TimeSlots.create({
        day_of_week,
        start_time,
        end_time
    });

    return createTimeSlot;
};

const UpdateTimeSlotData = async (time_slot_id, timeSlotData) => {
    const selectedTimeSlot = await TimeSlots.findByPk(time_slot_id);
    if (!selectedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    const newStart = timeSlotData.start_time || selectedTimeSlot.start_time;
    const newEnd = timeSlotData.end_time || selectedTimeSlot.end_time;

    if (newStart >= newEnd) {
        const err = new Error('Start time must be earlier than end time!');
        err.statusCode = 400;
        throw err;
    }

    if ((timeSlotData.day_of_week && timeSlotData.day_of_week !== selectedTimeSlot.day_of_week) ||
        (timeSlotData.start_time && timeSlotData.start_time !== selectedTimeSlot.start_time)) {
        const existedTimeSlot = await TimeSlots.findOne({
            where: {
                day_of_week: timeSlotData.day_of_week || selectedTimeSlot.day_of_week,
                start_time: timeSlotData.start_time || selectedTimeSlot.start_time,
                time_slot_id: { [Op.ne]: time_slot_id }
            }
        });
        if (existedTimeSlot) {
            const err = new Error('This time slot already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    await selectedTimeSlot.update(timeSlotData);

    return selectedTimeSlot;
};

const DeleteTimeSlotData = async (time_slot_id) => {
    const selectedTimeSlot = await TimeSlots.findByPk(time_slot_id);
    if (!selectedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedTimeSlot.destroy();
};

module.exports = {
    GetTimeSlotData,
    SelectedTimeSlotData,
    CreateTimeSlotData,
    UpdateTimeSlotData,
    DeleteTimeSlotData
};
