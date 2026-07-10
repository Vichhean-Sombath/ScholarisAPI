const LessonResources = require('../../models/lesson_resources.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');

const GetLessonResourceData = async () => {
    return await LessonResources.findAll({
        include: [
            { model: Schedules, attributes: ['schedule_id', 'day_of_week'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const SelectedLessonResourceData = async (resource_id) => {
    const lessonResource = await LessonResources.findByPk(resource_id, {
        include: [
            { model: Schedules, attributes: ['schedule_id', 'day_of_week'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });

    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
        throw err;
    }

    return lessonResource;
};

const CreateLessonResourceData = async (resourceData) => {
    const { schedule_id, teacher_id, title, description, resource_type, file_url, upload_date } = resourceData;

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

    return await LessonResources.create({
        schedule_id,
        teacher_id,
        title,
        description,
        resource_type,
        file_url,
        upload_date
    });
};

const UpdateLessonResourceData = async (resource_id, resourceData) => {
    const lessonResource = await LessonResources.findByPk(resource_id);
    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
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

    await lessonResource.update(resourceData);

    return lessonResource;
};

const DeleteLessonResourceData = async (resource_id) => {
    const lessonResource = await LessonResources.findByPk(resource_id);
    if (!lessonResource) {
        const err = new Error('Lesson resource not found!');
        err.statusCode = 404;
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
