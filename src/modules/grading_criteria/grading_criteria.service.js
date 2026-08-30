const GradingCriteria = require('../../models/grading_criteria.model');
const Subjects = require('../../models/subjects.model');
const Classes = require('../../models/classes.model');
const Assessments = require('../../models/assessments.model');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'subject', select: 'subject_id subject_code subject_name' },
    { path: 'class', select: 'class_id class_name' },
    { path: 'assessments', select: 'assessment_id assessment_name max_score' }
];

const GetGradingCriteriaData = async () => {
    return await GradingCriteria.find().populate(sharedPopulates);
};

const SelectedGradingCriteriaData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ criteria_id: Number(data) });
    }
    orConditions.push({ component_name: { $regex: data, $options: 'i' } });

    const selectedGradingCriteria = await GradingCriteria.findOne({
        $or: orConditions
    }).populate(sharedPopulates);

    if (!selectedGradingCriteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedGradingCriteria;
};

const CreateGradingCriteriaData = async (gradingCriteriaData) => {
    const { subject_id, class_id, component_name, weight_percentage, attempt_count } = gradingCriteriaData;

    if (subject_id) {
        const subject = await Subjects.findOne({ subject_id });
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (class_id) {
        const relatedClass = await Classes.findOne({ class_id });
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    let criteria_id = gradingCriteriaData.criteria_id;
    if (!criteria_id) {
        const lastCrit = await GradingCriteria.findOne().sort({ criteria_id: -1 });
        criteria_id = lastCrit ? lastCrit.criteria_id + 1 : 1;
    }

    const createGradingCriteria = await GradingCriteria.create({
        criteria_id,
        subject_id,
        class_id,
        component_name,
        weight_percentage,
        attempt_count
    });

    return createGradingCriteria;
};

const UpdateGradingCriteriaData = async (criteria_id, gradingCriteriaData) => {
    const selectedGradingCriteria = await GradingCriteria.findOne({ criteria_id });
    if (!selectedGradingCriteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    if (gradingCriteriaData.subject_id) {
        const subject = await Subjects.findOne({ subject_id: gradingCriteriaData.subject_id });
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(selectedGradingCriteria, gradingCriteriaData);
    await selectedGradingCriteria.save();

    return selectedGradingCriteria;
};

const DeleteGradingCriteriaData = async (criteria_id) => {
    const selectedGradingCriteria = await GradingCriteria.findOne({ criteria_id });
    if (!selectedGradingCriteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    await GradingCriteria.deleteOne({ criteria_id });
};

module.exports = {
    GetGradingCriteriaData,
    SelectedGradingCriteriaData,
    CreateGradingCriteriaData,
    UpdateGradingCriteriaData,
    DeleteGradingCriteriaData
};
