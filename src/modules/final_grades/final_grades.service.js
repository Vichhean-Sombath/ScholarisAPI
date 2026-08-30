const FinalGrades = require('../../models/final_grades.model');
const Students = require('../../models/students.model');
const Subjects = require('../../models/subjects.model');
const Classes = require('../../models/classes.model');
const Semesters = require('../../models/semesters.model');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'student', select: 'student_id first_name last_name' },
    { path: 'subject', select: 'subject_id subject_code subject_name' },
    { path: 'class', select: 'class_id class_name' },
    { path: 'semester', select: 'semester_id semester_name' }
];

const GetFinalGradeData = async () => {
    return await FinalGrades.find().populate(sharedPopulates);
};

const SelectedFinalGradeData = async (data) => {
    const selectedFinalGrade = await FinalGrades.findOne({ final_grade_id: data }).populate(sharedPopulates);

    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedFinalGrade;
};

const CreateFinalGradeData = async (finalGradeData) => {
    const { student_id, subject_id, class_id, semester_id, final_score, letter_grade, gpa_points } = finalGradeData;

    const student = await Students.findOne({ student_id });
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const subject = await Subjects.findOne({ subject_id });
    if (!subject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedClass = await Classes.findOne({ class_id });
    if (!relatedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    const semester = await Semesters.findOne({ semester_id });
    if (!semester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedFinalGrade = await FinalGrades.findOne({
        student_id, subject_id, semester_id
    });
    if (existedFinalGrade) {
        const err = new Error('Final grade already exists for this student, subject, and semester!');
        err.statusCode = 400;
        throw err;
    }

    let final_grade_id = finalGradeData.final_grade_id;
    if (!final_grade_id) {
        const lastFinal = await FinalGrades.findOne().sort({ final_grade_id: -1 });
        final_grade_id = lastFinal ? lastFinal.final_grade_id + 1 : 1;
    }

    const createFinalGrade = await FinalGrades.create({
        final_grade_id,
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
    const selectedFinalGrade = await FinalGrades.findOne({ final_grade_id });
    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    const newStudentId = finalGradeData.student_id || selectedFinalGrade.student_id;
    const newSubjectId = finalGradeData.subject_id || selectedFinalGrade.subject_id;
    const newSemesterId = finalGradeData.semester_id || selectedFinalGrade.semester_id;

    if (finalGradeData.student_id) {
        const student = await Students.findOne({ student_id: finalGradeData.student_id });
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.subject_id) {
        const subject = await Subjects.findOne({ subject_id: finalGradeData.subject_id });
        if (!subject) {
            const err = new Error('Subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.class_id) {
        const relatedClass = await Classes.findOne({ class_id: finalGradeData.class_id });
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (finalGradeData.semester_id) {
        const semester = await Semesters.findOne({ semester_id: finalGradeData.semester_id });
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
            student_id: newStudentId,
            subject_id: newSubjectId,
            semester_id: newSemesterId,
            final_grade_id: { $ne: final_grade_id }
        });
        if (existedFinalGrade) {
            const err = new Error('Final grade already exists for this student, subject, and semester!');
            err.statusCode = 400;
            throw err;
        }
    }

    Object.assign(selectedFinalGrade, finalGradeData);
    await selectedFinalGrade.save();

    return selectedFinalGrade;
};

const DeleteFinalGradeData = async (final_grade_id) => {
    const selectedFinalGrade = await FinalGrades.findOne({ final_grade_id });
    if (!selectedFinalGrade) {
        const err = new Error('Final grade not found!');
        err.statusCode = 404;
        throw err;
    }

    await FinalGrades.deleteOne({ final_grade_id });
};

module.exports = {
    GetFinalGradeData,
    SelectedFinalGradeData,
    CreateFinalGradeData,
    UpdateFinalGradeData,
    DeleteFinalGradeData
};
