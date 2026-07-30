const LessonResources = require('../../models/lesson_resources.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');
const TimeSlots = require('../../models/time_slots.model');

const GetLessonResourceData = async (currentUser) => {
    const where = currentUser.role === 'Teacher'
        ? { teacher_id: currentUser.teacher_id }
        : {};

    return await LessonResources.findAll({
        where,
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [{ model: TimeSlots, attributes: ['day_of_week', 'start_time', 'end_time'] }]
            },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const SelectedLessonResourceData = async (resource_id, currentUser) => {
    const lessonResource = await LessonResources.findByPk(resource_id, {
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [{ model: TimeSlots, attributes: ['day_of_week', 'start_time', 'end_time'] }]
            },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });

    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && lessonResource.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return lessonResource;
};

const CreateLessonResourceData = async (resourceData, currentUser) => {
    const { schedule_id, title, description, resource_type, file_url, upload_date } = resourceData;
    const teacher_id = currentUser.role === 'Teacher'
        ? currentUser.teacher_id
        : resourceData.teacher_id;

    const relatedTeacher = await Teachers.findByPk(teacher_id);
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if (schedule_id) {
        const relatedSchedule = await Schedules.findByPk(schedule_id);
        if (!relatedSchedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const createLessonResource = await LessonResources.create({
        schedule_id,
        teacher_id,
        title,
        description,
        resource_type,
        file_url,
        upload_date: upload_date || new Date()
    });

    return await LessonResources.findByPk(createLessonResource.resource_id, {
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [{ model: TimeSlots, attributes: ['day_of_week', 'start_time', 'end_time'] }]
            },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const UpdateLessonResourceData = async (resource_id, resourceData, currentUser) => {
    const lessonResource = await LessonResources.findByPk(resource_id);
    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && lessonResource.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.role === 'Teacher' && resourceData.teacher_id && parseInt(resourceData.teacher_id) !== currentUser.teacher_id) {
        const err = new Error('Cannot assign resource to another teacher!');
        err.statusCode = 403;
        throw err;
    }

    if (resourceData.teacher_id) {
        const relatedTeacher = await Teachers.findByPk(resourceData.teacher_id);
        if (!relatedTeacher) {
            const err = new Error('Teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (resourceData.schedule_id) {
        const relatedSchedule = await Schedules.findByPk(resourceData.schedule_id);
        if (!relatedSchedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await lessonResource.update({
        ...resourceData,
        upload_date: resourceData.upload_date || lessonResource.upload_date || new Date()
    });

    return await LessonResources.findByPk(resource_id, {
        include: [
            {
                model: Schedules,
                attributes: ['schedule_id'],
                include: [{ model: TimeSlots, attributes: ['day_of_week', 'start_time', 'end_time'] }]
            },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const DeleteLessonResourceData = async (resource_id, currentUser) => {
    const lessonResource = await LessonResources.findByPk(resource_id);
    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && lessonResource.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await lessonResource.destroy();
};

module.exports = {
    GetLessonResourceData,
    SelectedLessonResourceData,
    CreateLessonResourceData,
    UpdateLessonResourceData,
    DeleteLessonResourceData
};
