const Assessments = require('../../models/assessments.model');
const GradingCriteria = require('../../models/grading_criteria.model');
const Schedules = require('../../models/schedules.model');
const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const Teachers = require('../../models/teachers.model');
const TimeSlots = require('../../models/time_slots.model');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'criteria', select: 'criteria_id component_name weight_percentage' },
    {
        path: 'schedule',
        select: 'schedule_id class_id subject_id teacher_id time_slot_id room_number',
        populate: [
            { path: 'class', select: 'class_id class_name semester_id' },
            { path: 'subject', select: 'subject_id subject_code subject_name' },
            { path: 'teacher', select: 'teacher_id first_name last_name' },
            { path: 'timeSlot', select: 'time_slot_id day_of_week start_time end_time' }
        ]
    }
];

const GetAssessmentData = async (currentUser) => {
    let assessments = await Assessments.find().populate(sharedPopulates).lean();

    if (currentUser.role === 'Teacher') {
        assessments = assessments.filter(a => a.schedule && a.schedule.teacher_id === currentUser.teacher_id);
    }

    return assessments;
};

const SelectedAssessmentData = async (data, currentUser) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ assessment_id: Number(data) });
    }
    orConditions.push({ assessment_name: { $regex: data, $options: 'i' } });

    const selectedAssessment = await Assessments.findOne({
        $or: orConditions
    }).populate(sharedPopulates);

    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return selectedAssessment;
};

const CreateAssessmentData = async (assessmentData, currentUser) => {
    const { schedule_id, criteria_id, assessment_name, max_score, assessment_date } = assessmentData;

    const schedule = await Schedules.findOne({ schedule_id }).populate([
        { path: 'class', select: 'class_id class_name semester_id' },
        { path: 'subject', select: 'subject_id subject_code subject_name' },
        { path: 'teacher', select: 'teacher_id first_name last_name' }
    ]);
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

    const criteria = await GradingCriteria.findOne({ criteria_id });
    if (!criteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    const assessments = await Assessments.find({ criteria_id }).populate({
        path: 'schedule',
        populate: { path: 'class' }
    }).lean();

    const existingCount = assessments.filter(a =>
        a.schedule &&
        a.schedule.class_id === schedule.class_id &&
        a.schedule.subject_id === schedule.subject_id &&
        a.schedule.class &&
        a.schedule.class.semester_id === schedule.class?.semester_id
    ).length;

    if (existingCount >= Number(criteria.attempt_count)) {
        const err = new Error(`This criteria already has ${existingCount} assessment(s). Maximum allowed is ${criteria.attempt_count}.`);
        err.statusCode = 400;
        throw err;
    }

    let assessment_id = assessmentData.assessment_id;
    if (!assessment_id) {
        const lastAssess = await Assessments.findOne().sort({ assessment_id: -1 });
        assessment_id = lastAssess ? lastAssess.assessment_id + 1 : 1;
    }

    const createAssessment = await Assessments.create({
        assessment_id,
        schedule_id,
        criteria_id,
        assessment_name,
        max_score,
        assessment_date
    });

    return await Assessments.findOne({ assessment_id: createAssessment.assessment_id }).populate(sharedPopulates);
};

const UpdateAssessmentData = async (assessment_id, assessmentData, currentUser) => {
    const selectedAssessment = await Assessments.findOne({ assessment_id }).populate('schedule');
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (assessmentData.schedule_id) {
        const schedule = await Schedules.findOne({ schedule_id: assessmentData.schedule_id });
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
        const criteria = await GradingCriteria.findOne({ criteria_id: assessmentData.criteria_id });
        if (!criteria) {
            const err = new Error('Grading criteria not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(selectedAssessment, assessmentData);
    await selectedAssessment.save();

    return selectedAssessment;
};

const DeleteAssessmentData = async (assessment_id, currentUser) => {
    const selectedAssessment = await Assessments.findOne({ assessment_id }).populate('schedule');
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedAssessment.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await Assessments.deleteOne({ assessment_id });
};

module.exports = {
    GetAssessmentData,
    SelectedAssessmentData,
    CreateAssessmentData,
    UpdateAssessmentData,
    DeleteAssessmentData
};
