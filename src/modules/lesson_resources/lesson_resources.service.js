const LessonResources = require('../../models/lesson_resources.model');
const Schedules = require('../../models/schedules.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');

const lessonResourcePopulates = [
    {
        path: 'schedule',
        select: 'schedule_id time_slot_id',
        populate: {
            path: 'timeSlot',
            select: 'day_of_week start_time end_time'
        }
    },
    {
        path: 'teacher',
        select: 'teacher_id first_name last_name'
    }
];

const parseResourceId = (resourceId) => {
    const parsedId = Number(resourceId);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        const err = new Error('Lesson resource ID must be a positive integer!');
        err.statusCode = 400;
        throw err;
    }

    return parsedId;
};

const GetLessonResourceData = async (currentUser) => {
    const query = currentUser.role === 'Teacher'
        ? { teacher_id: currentUser.teacher_id }
        : {};

    return await LessonResources.find(query).populate(lessonResourcePopulates);
};

const SelectedLessonResourceData = async (resourceId, currentUser) => {
    const lessonResource = await LessonResources.findOne({
        resource_id: parseResourceId(resourceId)
    }).populate(lessonResourcePopulates);

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

    const relatedTeacher = await Teachers.findOne({ teacher_id });
    if (!relatedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if (schedule_id != null) {
        const relatedSchedule = await Schedules.findOne({ schedule_id });
        if (!relatedSchedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const lastResource = await LessonResources.findOne()
        .sort({ resource_id: -1 })
        .select('resource_id');
    const resource_id = lastResource ? lastResource.resource_id + 1 : 1;

    const lessonResource = await LessonResources.create({
        resource_id,
        schedule_id,
        teacher_id,
        title,
        description,
        resource_type,
        file_url,
        upload_date: upload_date || new Date()
    });

    return await lessonResource.populate(lessonResourcePopulates);
};

const UpdateLessonResourceData = async (resourceId, resourceData, currentUser) => {
    const lessonResource = await LessonResources.findOne({
        resource_id: parseResourceId(resourceId)
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

    if (
        currentUser.role === 'Teacher'
        && resourceData.teacher_id !== undefined
        && resourceData.teacher_id !== currentUser.teacher_id
    ) {
        const err = new Error('Cannot assign resource to another teacher!');
        err.statusCode = 403;
        throw err;
    }

    if (resourceData.teacher_id !== undefined) {
        const relatedTeacher = await Teachers.findOne({ teacher_id: resourceData.teacher_id });
        if (!relatedTeacher) {
            const err = new Error('Teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (resourceData.schedule_id != null) {
        const relatedSchedule = await Schedules.findOne({ schedule_id: resourceData.schedule_id });
        if (!relatedSchedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(lessonResource, resourceData);
    await lessonResource.save();

    return await lessonResource.populate(lessonResourcePopulates);
};

const DeleteLessonResourceData = async (resourceId, currentUser) => {
    const lessonResource = await LessonResources.findOne({
        resource_id: parseResourceId(resourceId)
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

    await lessonResource.deleteOne();
};

module.exports = {
    GetLessonResourceData,
    SelectedLessonResourceData,
    CreateLessonResourceData,
    UpdateLessonResourceData,
    DeleteLessonResourceData
};
