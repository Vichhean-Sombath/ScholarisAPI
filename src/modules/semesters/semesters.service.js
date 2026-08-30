const Semesters = require('../../models/semesters.model');
const AcademicYears = require('../../models/academic_years.model');
require('../../models/mappingContext');

const GetSemesterData = async () => {
    return await Semesters.find().populate({
        path: 'academicYear',
        select: 'academic_year_id year_name start_date end_date'
    });
};

const SelectedSemesterData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ semester_id: Number(data) });
    }
    orConditions.push({ semester_name: { $regex: data, $options: 'i' } });

    const selectedSemester = await Semesters.findOne({
        $or: orConditions
    }).populate({
        path: 'academicYear',
        select: 'academic_year_id year_name start_date end_date'
    });

    if (!selectedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedSemester;
};

const CreateSemesterData = async (semesterData) => {
    const { academic_year_id, semester_name, start_date, end_date } = semesterData;

    const academicYear = await AcademicYears.findOne({ academic_year_id });
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    const minEndDate = new Date(startDate);
    minEndDate.setMonth(minEndDate.getMonth() + 3);
    if (endDate < minEndDate) {
        const err = new Error('Semester duration must be at least 3 months!');
        err.statusCode = 400;
        throw err;
    }

    if (startDate < new Date(academicYear.start_date) || endDate > new Date(academicYear.end_date)) {
        const err = new Error('Semester dates must be within the academic year range!');
        err.statusCode = 400;
        throw err;
    }

    const existedSemesterName = await Semesters.findOne({
        academic_year_id,
        semester_name
    });
    if (existedSemesterName) {
        const err = new Error('This semester name already exists for the selected academic year!');
        err.statusCode = 400;
        throw err;
    }

    let semester_id = semesterData.semester_id;
    if (!semester_id) {
        const lastSem = await Semesters.findOne().sort({ semester_id: -1 });
        semester_id = lastSem ? lastSem.semester_id + 1 : 1;
    }

    const createSemester = await Semesters.create({
        semester_id,
        academic_year_id,
        semester_name,
        start_date,
        end_date
    });

    return createSemester;
};

const UpdateSemesterData = async (semester_id, semesterData) => {
    const selectedSemester = await Semesters.findOne({ semester_id });
    if (!selectedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    const academicYearId = semesterData.academic_year_id || selectedSemester.academic_year_id;
    const academicYear = await AcademicYears.findOne({ academic_year_id: academicYearId });
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    const newStartDate = new Date(semesterData.start_date || selectedSemester.start_date);
    const newEndDate = new Date(semesterData.end_date || selectedSemester.end_date);

    if (newStartDate >= newEndDate) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    const minEndDate = new Date(newStartDate);
    minEndDate.setMonth(minEndDate.getMonth() + 3);
    if (newEndDate < minEndDate) {
        const err = new Error('Semester duration must be at least 3 months!');
        err.statusCode = 400;
        throw err;
    }

    if (newStartDate < new Date(academicYear.start_date) || newEndDate > new Date(academicYear.end_date)) {
        const err = new Error('Semester dates must be within the academic year range!');
        err.statusCode = 400;
        throw err;
    }

    if (semesterData.semester_name && (semesterData.semester_name !== selectedSemester.semester_name || parseInt(academicYearId) !== parseInt(selectedSemester.academic_year_id))) {
        const existedSemesterName = await Semesters.findOne({
            academic_year_id: academicYearId,
            semester_name: semesterData.semester_name
        });
        if (existedSemesterName) {
            const err = new Error('This semester name already exists for the selected academic year!');
            err.statusCode = 400;
            throw err;
        }
    }

    Object.assign(selectedSemester, semesterData);
    await selectedSemester.save();

    return selectedSemester;
};

const DeleteSemesterData = async (semester_id) => {
    const selectedSemester = await Semesters.findOne({ semester_id });
    if (!selectedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    await Semesters.deleteOne({ semester_id });
};

module.exports = {
    GetSemesterData,
    SelectedSemesterData,
    CreateSemesterData,
    UpdateSemesterData,
    DeleteSemesterData
};
