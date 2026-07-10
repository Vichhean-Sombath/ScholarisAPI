const FinalGrades = require('../../models/final_grades.model');
const Students = require('../../models/students.model');
const Subjects = require('../../models/subjects.model');
const Classes = require('../../models/classes.model');
const Semesters = require('../../models/semesters.model');
const { Op } = require('sequelize');

const GetFinalGradeData = async () => {
    return await FinalGrades.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] }
        ]
    });
};

const SelectedFinalGradeData = async (data) => {
    const selectedFinalGrade = await FinalGrades.findByPk(data, {
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] }
        ]
    });

    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedFinalGrade;
};

const CreateFinalGradeData = async (finalGradeData) => {
    const { student_id, subject_id, class_id, semester_id, final_score, letter_grade, gpa_points } = finalGradeData;

    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const subject = await Subjects.findByPk(subject_id);
    if (!subject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedClass = await Classes.findByPk(class_id);
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const semester = await Semesters.findByPk(semester_id);
    if (!semester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedFinalGrade = await FinalGrades.findOne({
        where: { student_id, subject_id, semester_id }
    });
    if (existedFinalGrade) {
        const err = new Error('Final grade already exists for this student, subject, and semester!');
        err.statusCode = 400;
        throw err;
    }

    const createFinalGrade = await FinalGrades.create({
        student_id,
        subject_id,
        class_id,
        semester_id,
        final_score,
        letter_grade,
        gpa_points
    });

    return createFinalGrade;
};

const UpdateFinalGradeData = async (final_grade_id, finalGradeData) => {
    const selectedFinalGrade = await FinalGrades.findByPk(final_grade_id);
    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    const newStudentId = finalGradeData.student_id || selectedFinalGrade.student_id;
    const newSubjectId = finalGradeData.subject_id || selectedFinalGrade.subject_id;
    const newSemesterId = finalGradeData.semester_id || selectedFinalGrade.semester_id;

    if (finalGradeData.student_id) {
        const student = await Students.findByPk(finalGradeData.student_id);
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.subject_id) {
        const subject = await Subjects.findByPk(finalGradeData.subject_id);
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.class_id) {
        const relatedClass = await Classes.findByPk(finalGradeData.class_id);
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.semester_id) {
        const semester = await Semesters.findByPk(finalGradeData.semester_id);
        if (!semester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if ((finalGradeData.student_id && parseInt(finalGradeData.student_id) !== parseInt(selectedFinalGrade.student_id)) ||
        (finalGradeData.subject_id && parseInt(finalGradeData.subject_id) !== parseInt(selectedFinalGrade.subject_id)) ||
        (finalGradeData.semester_id && parseInt(finalGradeData.semester_id) !== parseInt(selectedFinalGrade.semester_id))) {
        const existedFinalGrade = await FinalGrades.findOne({
            where: {
                student_id: newStudentId,
                subject_id: newSubjectId,
                semester_id: newSemesterId,
                final_grade_id: { [Op.ne]: final_grade_id }
            }
        });
        if (existedFinalGrade) {
            const err = new Error('Final grade already exists for this student, subject, and semester!');
            err.statusCode = 400;
            throw err;
        }
    }

    await selectedFinalGrade.update(finalGradeData);

    return selectedFinalGrade;
};

const DeleteFinalGradeData = async (final_grade_id) => {
    const selectedFinalGrade = await FinalGrades.findByPk(final_grade_id);
    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedFinalGrade.destroy();
};

module.exports = {
    GetFinalGradeData,
    SelectedFinalGradeData,
    CreateFinalGradeData,
    UpdateFinalGradeData,
    DeleteFinalGradeData
};
