const GradingCriteria = require('../../models/grading_criteria.model');
const Subjects = require('../../models/subjects.model');
const Classes = require('../../models/classes.model');
const Assessments = require('../../models/assessments.model');
const { Op } = require('sequelize');

const GetGradingCriteriaData = async () => {
    return await GradingCriteria.findAll({
        include: [
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Assessments, attributes: ['assessment_id', 'assessment_name', 'max_score'] }
        ]
    });
};

const SelectedGradingCriteriaData = async (data) => {
    const selectedGradingCriteria = await GradingCriteria.findOne({
        where: {
            [Op.or]: [
                { criteria_id: data },
                { component_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Assessments, attributes: ['assessment_id', 'assessment_name', 'max_score'] }
        ]
    });

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
        const subject = await Subjects.findByPk(subject_id);
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (class_id) {
        const relatedClass = await Classes.findByPk(class_id);
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const createGradingCriteria = await GradingCriteria.create({
        subject_id,
        class_id,
        component_name,
        weight_percentage,
        attempt_count
    });

    return createGradingCriteria;
};

const UpdateGradingCriteriaData = async (criteria_id, gradingCriteriaData) => {
    const selectedGradingCriteria = await GradingCriteria.findByPk(criteria_id);
    if (!selectedGradingCriteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    if (gradingCriteriaData.subject_id) {
        const subject = await Subjects.findByPk(gradingCriteriaData.subject_id);
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedGradingCriteria.update(gradingCriteriaData);

    return selectedGradingCriteria;
};

const DeleteGradingCriteriaData = async (criteria_id) => {
    const selectedGradingCriteria = await GradingCriteria.findByPk(criteria_id);
    if (!selectedGradingCriteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedGradingCriteria.destroy();
};

module.exports = {
    GetGradingCriteriaData,
    SelectedGradingCriteriaData,
    CreateGradingCriteriaData,
    UpdateGradingCriteriaData,
    DeleteGradingCriteriaData
};
