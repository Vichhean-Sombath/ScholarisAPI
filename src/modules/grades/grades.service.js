const Grades = require('../../models/grades.model');
const Assessments = require('../../models/assessments.model');
const Students = require('../../models/students.model');
const Teachers = require('../../models/teachers.model');
const { Op } = require('sequelize');

const GetGradeData = async () => {
    return await Grades.findAll({
        include: [
            { model: Assessments, attributes: ['assessment_id', 'assessment_name', 'max_score'] },
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Teachers, as: 'EnteredBy', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });
};

const SelectedGradeData = async (data) => {
    const selectedGrade = await Grades.findByPk(data, {
        include: [
            { model: Assessments, attributes: ['assessment_id', 'assessment_name', 'max_score'] },
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Teachers, as: 'EnteredBy', attributes: ['teacher_id', 'first_name', 'last_name'] }
        ]
    });

    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedGrade;
};

const CreateGradeData = async (gradeData) => {
    const { assessment_id, student_id, score, entered_by, is_published } = gradeData;

    const assessment = await Assessments.findByPk(assessment_id);
    if (!assessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const teacher = await Teachers.findByPk(entered_by);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if (Number(score) > Number(assessment.max_score)) {
        const err = new Error(`Score cannot exceed assessment max score of ${assessment.max_score}!`);
        err.statusCode = 400;
        throw err;
    }

    const existedGrade = await Grades.findOne({
        where: { assessment_id, student_id }
    });
    if (existedGrade) {
        const err = new Error('Grade already exists for this assessment and student!');
        err.statusCode = 400;
        throw err;
    }

    const createGrade = await Grades.create({
        assessment_id,
        student_id,
        score,
        entered_by,
        is_published
    });

    return createGrade;
};

const UpdateGradeData = async (grade_id, gradeData) => {
    const selectedGrade = await Grades.findByPk(grade_id);
    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    const newAssessmentId = gradeData.assessment_id || selectedGrade.assessment_id;
    const newStudentId = gradeData.student_id || selectedGrade.student_id;

    const assessment = await Assessments.findByPk(newAssessmentId);
    if (!assessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (gradeData.student_id) {
        const student = await Students.findByPk(gradeData.student_id);
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (gradeData.entered_by) {
        const teacher = await Teachers.findByPk(gradeData.entered_by);
        if (!teacher) {
            const err = new Error('Teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const newScore = gradeData.score !== undefined ? gradeData.score : selectedGrade.score;
    if (Number(newScore) > Number(assessment.max_score)) {
        const err = new Error(`Score cannot exceed assessment max score of ${assessment.max_score}!`);
        err.statusCode = 400;
        throw err;
    }

    if ((gradeData.assessment_id && parseInt(gradeData.assessment_id) !== parseInt(selectedGrade.assessment_id)) ||
        (gradeData.student_id && parseInt(gradeData.student_id) !== parseInt(selectedGrade.student_id))) {
        const existedGrade = await Grades.findOne({
            where: {
                assessment_id: newAssessmentId,
                student_id: newStudentId,
                grade_id: { [Op.ne]: grade_id }
            }
        });
        if (existedGrade) {
            const err = new Error('Grade already exists for this assessment and student!');
            err.statusCode = 400;
            throw err;
        }
    }

    await selectedGrade.update(gradeData);

    return selectedGrade;
};

const DeleteGradeData = async (grade_id) => {
    const selectedGrade = await Grades.findByPk(grade_id);
    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedGrade.destroy();
};

module.exports = {
    GetGradeData,
    SelectedGradeData,
    CreateGradeData,
    UpdateGradeData,
    DeleteGradeData
};
