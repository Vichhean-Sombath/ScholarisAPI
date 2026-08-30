const TimeSlots = require('../../models/time_slots.model');
const Schedules = require('../../models/schedules.model');
require('../../models/mappingContext');

const sharedPopulate = { path: 'schedules', select: 'schedule_id class_id subject_id teacher_id room_number' };

const GetTimeSlotData = async () => {
    return await TimeSlots.find().populate(sharedPopulate);
};

const SelectedTimeSlotData = async (data) => {
    const selectedTimeSlot = await TimeSlots.findOne({ time_slot_id: data }).populate(sharedPopulate);

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
        day_of_week, start_time
    });
    if (existedTimeSlot) {
        const err = new Error('This time slot already exists!');
        err.statusCode = 400;
        throw err;
    }

    let time_slot_id = timeSlotData.time_slot_id;
    if (!time_slot_id) {
        const lastSlot = await TimeSlots.findOne().sort({ time_slot_id: -1 });
        time_slot_id = lastSlot ? lastSlot.time_slot_id + 1 : 1;
    }

    const createTimeSlot = await TimeSlots.create({
        time_slot_id,
        day_of_week,
        start_time,
        end_time
    });

    return createTimeSlot;
};

const UpdateTimeSlotData = async (time_slot_id, timeSlotData) => {
    const selectedTimeSlot = await TimeSlots.findOne({ time_slot_id });
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
            day_of_week: timeSlotData.day_of_week || selectedTimeSlot.day_of_week,
            start_time: timeSlotData.start_time || selectedTimeSlot.start_time,
            time_slot_id: { $ne: time_slot_id }
        });
        if (existedTimeSlot) {
            const err = new Error('This time slot already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    Object.assign(selectedTimeSlot, timeSlotData);
    await selectedTimeSlot.save();

    return selectedTimeSlot;
};

const DeleteTimeSlotData = async (time_slot_id) => {
    const selectedTimeSlot = await TimeSlots.findOne({ time_slot_id });
    if (!selectedTimeSlot) {
        const err = new Error('Time slot not found!');
        err.statusCode = 404;
        throw err;
    }

    await TimeSlots.deleteOne({ time_slot_id });
};

module.exports = {
    GetTimeSlotData,
    SelectedTimeSlotData,
    CreateTimeSlotData,
    UpdateTimeSlotData,
    DeleteTimeSlotData
};
