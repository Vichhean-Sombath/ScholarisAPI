const Assessments = require('../../models/assessments.model');
const GradingCriteria = require('../../models/grading_criteria.model');
const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const Teachers = require('../../models/teachers.model');
const Grades = require('../../models/grades.model');
const { Op } = require('sequelize');

const GetAssessmentData = async () => {
    return await Assessments.findAll({
        include: [
            { model: GradingCriteria, attributes: ['criteria_id', 'component_name', 'weight_percentage'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: Grades, attributes: ['grade_id', 'student_id', 'score'] }
        ]
    });
};

const SelectedAssessmentData = async (data) => {
    const selectedAssessment = await Assessments.findOne({
        where: {
            [Op.or]: [
                { assessment_id: data },
                { assessment_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: GradingCriteria, attributes: ['criteria_id', 'component_name', 'weight_percentage'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Teachers, attributes: ['teacher_id', 'first_name', 'last_name'] },
            { model: Grades, attributes: ['grade_id', 'student_id', 'score'] }
        ]
    });

    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedAssessment;
};

const CreateAssessmentData = async (assessmentData) => {
    const { criteria_id, class_id, subject_id, teacher_id, assessment_name, max_score, assessment_date } = assessmentData;

    const criteria = await GradingCriteria.findByPk(criteria_id);
    if (!criteria) {
        const err = new Error('Grading criteria not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedClass = await Classes.findByPk(class_id);
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const subject = await Subjects.findByPk(subject_id);
    if (!subject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const teacher = await Teachers.findByPk(teacher_id);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    const createAssessment = await Assessments.create({
        criteria_id,
        class_id,
        subject_id,
        teacher_id,
        assessment_name,
        max_score,
        assessment_date
    });

    return createAssessment;
};

const UpdateAssessmentData = async (assessment_id, assessmentData) => {
    const selectedAssessment = await Assessments.findByPk(assessment_id);
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (assessmentData.criteria_id) {
        const criteria = await GradingCriteria.findByPk(assessmentData.criteria_id);
        if (!criteria) {
            const err = new Error('Grading criteria not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (assessmentData.class_id) {
        const relatedClass = await Classes.findByPk(assessmentData.class_id);
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (assessmentData.subject_id) {
        const subject = await Subjects.findByPk(assessmentData.subject_id);
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (assessmentData.teacher_id) {
        const teacher = await Teachers.findByPk(assessmentData.teacher_id);
        if (!teacher) {
            const err = new Error('Teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedAssessment.update(assessmentData);

    return selectedAssessment;
};

const DeleteAssessmentData = async (assessment_id) => {
    const selectedAssessment = await Assessments.findByPk(assessment_id);
    if (!selectedAssessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
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
