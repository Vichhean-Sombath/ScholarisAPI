const Assessments = require('../../models/assessments.model');
const GradingCriteria = require('../../models/grading_criteria.model');
const Schedules = require('../../models/schedules.model');
const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const Teachers = require('../../models/teachers.model');
const TimeSlots = require('../../models/time_slots.model');
const { Op, Sequelize } = require('sequelize');

const GetAssessmentData = async (currentUser) => {
    const where = currentUser.role === 'Teacher'
        ? { '$Schedule.teacher_id$': currentUser.teacher_id }
        : {};

    return await Assessments.findAll({
        where,
        include: [
            { model: GradingCriteria, attributes: ['criteria_id', 'component_name', 'weight_percentage'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'class_id', 'subject_id', 'teacher_id', 'time_slot_id', 'room_number'],
                include: [
                    { model: Classes, attributes: ['class_id', 'class_name', 'semester_id'] },
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
                ]
            }
        ]
    });
};

const SelectedAssessmentData = async (data, currentUser) => {
    const selectedAssessment = await Assessments.findOne({
        where: {
            [Op.or]: [
                { assessment_id: data },
                { assessment_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: GradingCriteria, attributes: ['criteria_id', 'component_name', 'weight_percentage'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'class_id', 'subject_id', 'teacher_id', 'time_slot_id', 'room_number'],
                include: [
                    { model: Classes, attributes: ['class_id', 'class_name', 'semester_id'] },
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
                ]
            }
        ]
    });

    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return selectedAssessment;
};

const CreateAssessmentData = async (assessmentData, currentUser) => {
    const { schedule_id, criteria_id, assessment_name, max_score, assessment_date } = assessmentData;

    const schedule = await Schedules.findByPk(schedule_id, {
        include: [
            { model: Classes, attributes: ['class_id', 'class_name', 'semester_id'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
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

    const criteria = await GradingCriteria.findByPk(criteria_id);
    if (!criteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    const existingCount = await Assessments.count({
        where: { criteria_id },
        include: [
            {
                model: Schedules,
                where: {
                    class_id: schedule.class_id,
                    subject_id: schedule.subject_id
                },
                include: [
                    {
                        model: Classes,
                        where: { semester_id: schedule.Class.semester_id }
                    }
                ]
            }
        ]
    });

    if (existingCount >= Number(criteria.attempt_count)) {
        const err = new Error(`This criteria already has ${existingCount} assessment(s). Maximum allowed is ${criteria.attempt_count}.`);
        err.statusCode = 400;
        throw err;
    }

    const createAssessment = await Assessments.create({
        schedule_id,
        criteria_id,
        assessment_name,
        max_score,
        assessment_date
    });

    return await Assessments.findByPk(createAssessment.assessment_id, {
        include: [
            { model: GradingCriteria, attributes: ['criteria_id', 'component_name', 'weight_percentage'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'class_id', 'subject_id', 'teacher_id', 'time_slot_id', 'room_number'],
                include: [
                    { model: Classes, attributes: ['class_id', 'class_name', 'semester_id'] },
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
                ]
            }
        ]
    });
};

const UpdateAssessmentData = async (assessment_id, assessmentData, currentUser) => {
    const selectedAssessment = await Assessments.findByPk(assessment_id, {
        include: [{ model: Schedules, attributes: ['teacher_id'] }]
    });
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (assessmentData.schedule_id) {
        const schedule = await Schedules.findByPk(assessmentData.schedule_id);
        if (!schedule) {
            const err = new Error('Schedule not found!');
            err.statusCode = 404;
            throw err;
        }

        if (currentUser.role === 'Teacher' && schedule.teacher_id !== currentUser.teacher_id) {
            const err = new Error('Cannot assign assessment to another teacher!');
            err.statusCode = 403;
            throw err;
        }
    }

    if (assessmentData.criteria_id) {
        const criteria = await GradingCriteria.findByPk(assessmentData.criteria_id);
        if (!criteria) {
            const err = new Error('Grading criteria not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedAssessment.update(assessmentData);

    return selectedAssessment;
};

const DeleteAssessmentData = async (assessment_id, currentUser) => {
    const selectedAssessment = await Assessments.findByPk(assessment_id, {
        include: [{ model: Schedules, attributes: ['teacher_id'] }]
    });
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.Schedule.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await selectedAssessment.destroy();
};

module.exports = {
    GetAssessmentData,
    SelectedAssessmentData,
    CreateAssessmentData,
    UpdateAssessmentData,
    DeleteAssessmentData
};
