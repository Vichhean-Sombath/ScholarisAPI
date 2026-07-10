const Semesters = require('../../models/semesters.model');
const AcademicYears = require('../../models/academic_years.model');
const { Op } = require('sequelize');

const GetSemesterData = async () => {
    return await Semesters.findAll({
        include: [{
            model: AcademicYears,
            attributes: ['academic_year_id', 'year_name', 'start_date', 'end_date']
        }]
    });
};

const SelectedSemesterData = async (data) => {
    const selectedSemester = await Semesters.findOne({
        where: {
            [Op.or]: [
                { semester_id: data },
                { semester_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: AcademicYears,
            attributes: ['academic_year_id', 'year_name', 'start_date', 'end_date']
        }]
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

    const academicYear = await AcademicYears.findByPk(academic_year_id);
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    if (new Date(start_date) >= new Date(end_date)) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    if (new Date(start_date) < new Date(academicYear.start_date) || new Date(end_date) > new Date(academicYear.end_date)) {
        const err = new Error('Semester dates must be within the academic year range!');
        err.statusCode = 400;
        throw err;
    }

    const existedSemesterName = await Semesters.findOne({
        where: {
            academic_year_id,
            semester_name
        }
    });
    if (existedSemesterName) {
        const err = new Error('This semester name already exists for the selected academic year!');
        err.statusCode = 400;
        throw err;
    }

    const createSemester = await Semesters.create({
        academic_year_id,
        semester_name,
        start_date,
        end_date
    });

    return createSemester;
};

const UpdateSemesterData = async (semester_id, semesterData) => {
    const selectedSemester = await Semesters.findByPk(semester_id);
    if (!selectedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    const academicYearId = semesterData.academic_year_id || selectedSemester.academic_year_id;
    const academicYear = await AcademicYears.findByPk(academicYearId);
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    const newStart = semesterData.start_date || selectedSemester.start_date;
    const newEnd = semesterData.end_date || selectedSemester.end_date;

    if (new Date(newStart) >= new Date(newEnd)) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    if (new Date(newStart) < new Date(academicYear.start_date) || new Date(newEnd) > new Date(academicYear.end_date)) {
        const err = new Error('Semester dates must be within the academic year range!');
        err.statusCode = 400;
        throw err;
    }

    if (semesterData.semester_name && (semesterData.semester_name !== selectedSemester.semester_name || parseInt(academicYearId) !== parseInt(selectedSemester.academic_year_id))) {
        const existedSemesterName = await Semesters.findOne({
            where: {
                academic_year_id: academicYearId,
                semester_name: semesterData.semester_name
            }
        });
        if (existedSemesterName) {
            const err = new Error('This semester name already exists for the selected academic year!');
            err.statusCode = 400;
            throw err;
        }
    }

    await selectedSemester.update(semesterData);

    return selectedSemester;
};

const DeleteSemesterData = async (semester_id) => {
    const selectedSemester = await Semesters.findByPk(semester_id);
    if (!selectedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedSemester.destroy();
};

module.exports = {
    GetSemesterData,
    SelectedSemesterData,
    CreateSemesterData,
    UpdateSemesterData,
    DeleteSemesterData
};
