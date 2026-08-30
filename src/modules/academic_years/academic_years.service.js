const AcademicYears = require('../../models/academic_years.model');
const Semesters = require('../../models/semesters.model');

const GetAcademicYearData = async () => {
    return await AcademicYears.find().populate({
        path: 'semesters',
        select: 'semester_id semester_name start_date end_date'
    });
};

const SelectedAcademicYearData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ academic_year_id: Number(data) });
    }
    orConditions.push({ year_name: { $regex: data, $options: 'i' } });

    const selectedAcademicYear = await AcademicYears.findOne({
        $or: orConditions
    }).populate({
        path: 'semesters',
        select: 'semester_id semester_name start_date end_date'
    });

    if (!selectedAcademicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedAcademicYear;
};

const CreateAcademicYearData = async (academicYearData) => {
    const { year_name, start_date, end_date, status } = academicYearData;

    const existedYearName = await AcademicYears.findOne({ year_name });
    if (existedYearName) {
        const err = new Error('This year name already exists!');
        err.statusCode = 400;
        throw err;
    }

    if (new Date(start_date) >= new Date(end_date)) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    // In a production MongoDB environment with Mongoose, you would automatically generate IDs.
    // For compatibility during the migration, we will generate user_id / academic_year_id sequentially
    // if not already provided.
    let academic_year_id = academicYearData.academic_year_id;
    if (!academic_year_id) {
        const lastYear = await AcademicYears.findOne().sort({ academic_year_id: -1 });
        academic_year_id = lastYear ? lastYear.academic_year_id + 1 : 1;
    }

    const createAcademicYear = await AcademicYears.create({
        academic_year_id,
        year_name,
        start_date,
        end_date,
        status
    });

    return createAcademicYear;
};

const UpdateAcademicYearData = async (academic_year_id, academicYearData) => {
    const selectedAcademicYear = await AcademicYears.findOne({ academic_year_id });
    if (!selectedAcademicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    if (academicYearData.year_name && academicYearData.year_name !== selectedAcademicYear.year_name) {
        const existedYearName = await AcademicYears.findOne({ year_name: academicYearData.year_name });
        if (existedYearName) {
            const err = new Error('This year name already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    const newStart = academicYearData.start_date || selectedAcademicYear.start_date;
    const newEnd = academicYearData.end_date || selectedAcademicYear.end_date;
    if (new Date(newStart) >= new Date(newEnd)) {
        const err = new Error('Start date must be earlier than end date!');
        err.statusCode = 400;
        throw err;
    }

    Object.assign(selectedAcademicYear, academicYearData);
    await selectedAcademicYear.save();

    return selectedAcademicYear;
};

const DeleteAcademicYearData = async (academic_year_id) => {
    const selectedAcademicYear = await AcademicYears.findOne({ academic_year_id });
    if (!selectedAcademicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    await AcademicYears.deleteOne({ academic_year_id });
};

module.exports = {
    GetAcademicYearData,
    SelectedAcademicYearData,
    CreateAcademicYearData,
    UpdateAcademicYearData,
    DeleteAcademicYearData
};
