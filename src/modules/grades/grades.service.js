const Grades = require('../../models/grades.model');
const Assessments = require('../../models/assessments.model');
const Schedules = require('../../models/schedules.model');
const Students = require('../../models/students.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');

const getPopulateOptions = (currentUser) => {
    const scheduleMatch = currentUser.role === 'Teacher' ? { teacher_id: currentUser.teacher_id } : {};
    return [
        {
            path: 'assessment',
            select: 'assessment_id assessment_name max_score',
            populate: {
                path: 'schedule',
                select: 'schedule_id teacher_id',
                match: scheduleMatch
            }
        },
        { path: 'student', select: 'student_id first_name last_name' },
        { path: 'enteredBy', select: 'teacher_id first_name last_name' }
    ];
};

const GetGradeData = async (currentUser, assessmentId) => {
    const query = assessmentId ? { assessment_id: Number(assessmentId) } : {};

    let grades = await Grades.find(query).populate(getPopulateOptions(currentUser)).lean();

    if (currentUser.role === 'Teacher') {
        grades = grades.filter(g => g.assessment && g.assessment.schedule);
    }

    return grades;
};

const SelectedGradeData = async (data, currentUser) => {
    const selectedGrade = await Grades.findOne({ grade_id: data }).populate([
        {
            path: 'assessment',
            select: 'assessment_id assessment_name max_score',
            populate: { path: 'schedule', select: 'teacher_id' }
        },
        { path: 'student', select: 'student_id first_name last_name' },
        { path: 'enteredBy', select: 'teacher_id first_name last_name' }
    ]);

    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedGrade.assessment?.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    return selectedGrade;
};

const CreateGradeData = async (gradeData, currentUser) => {
    const { assessment_id, student_id, score, is_published } = gradeData;
    const entered_by = currentUser.role === 'Teacher'
        ? currentUser.teacher_id
        : gradeData.entered_by;

    const assessment = await Assessments.findOne({ assessment_id }).populate({ path: 'schedule', select: 'teacher_id' });
    if (!assessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && assessment.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    const student = await Students.findOne({ student_id });
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const teacher = await Teachers.findOne({ teacher_id: entered_by });
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

    const existedGrade = await Grades.findOne({ assessment_id, student_id });
    if (existedGrade) {
        const err = new Error('Grade already exists for this assessment and student!');
        err.statusCode = 400;
        throw err;
    }

    let grade_id = gradeData.grade_id;
    if (!grade_id) {
        const lastGrade = await Grades.findOne().sort({ grade_id: -1 });
        grade_id = lastGrade ? lastGrade.grade_id + 1 : 1;
    }

    const createGrade = await Grades.create({
        grade_id,
        assessment_id,
        student_id,
        score,
        entered_by,
        is_published
    });

    return createGrade;
};

const UpdateGradeData = async (grade_id, gradeData, currentUser) => {
    const selectedGrade = await Grades.findOne({ grade_id }).populate({
        path: 'assessment',
        populate: { path: 'schedule' }
    });
    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedGrade.assessment?.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.role === 'Teacher' && gradeData.entered_by && parseInt(gradeData.entered_by) !== currentUser.teacher_id) {
        const err = new Error('Cannot assign grade to another teacher!');
        err.statusCode = 403;
        throw err;
    }

    const newAssessmentId = gradeData.assessment_id || selectedGrade.assessment_id;
    const newStudentId = gradeData.student_id || selectedGrade.student_id;

    const assessment = await Assessments.findOne({ assessment_id: newAssessmentId });
    if (!assessment) {
        const err = new Error('Assessment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (gradeData.student_id) {
        const student = await Students.findOne({ student_id: gradeData.student_id });
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (gradeData.entered_by) {
        const teacher = await Teachers.findOne({ teacher_id: gradeData.entered_by });
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
            assessment_id: newAssessmentId,
            student_id: newStudentId,
            grade_id: { $ne: grade_id }
        });
        if (existedGrade) {
            const err = new Error('Grade already exists for this assessment and student!');
            err.statusCode = 400;
            throw err;
        }
    }

    Object.assign(selectedGrade, gradeData);
    await selectedGrade.save();

    return selectedGrade;
};

const DeleteGradeData = async (grade_id, currentUser) => {
    const selectedGrade = await Grades.findOne({ grade_id }).populate({
        path: 'assessment',
        populate: { path: 'schedule' }
    });
    if (!selectedGrade) {
        const err = new Error('Grade not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && selectedGrade.assessment?.schedule?.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    await Grades.deleteOne({ grade_id });
};

module.exports = {
    GetGradeData,
    SelectedGradeData,
    CreateGradeData,
    UpdateGradeData,
    DeleteGradeData
};
