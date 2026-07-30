const AcademicYears = require('../../models/academic_years.model');
const Semesters = require('../../models/semesters.model');
const { Op } = require('sequelize');

const GetAcademicYearData = async () => {
    return await AcademicYears.findAll({
        include: [{
            model: Semesters,
            attributes: ['semester_id', 'semester_name', 'start_date', 'end_date']
        }]
    });
};

const SelectedAcademicYearData = async (data) => {
    const selectedAcademicYear = await AcademicYears.findOne({
        where: {
            [Op.or]: [
                { academic_year_id: data },
                { year_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: Semesters,
            attributes: ['semester_id', 'semester_name', 'start_date', 'end_date']
        }]
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

    const existedYearName = await AcademicYears.findOne({ where: { year_name } });
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

    const createAcademicYear = await AcademicYears.create({
        year_name,
        start_date,
        end_date,
        status
    });

    return createAcademicYear;
};

const UpdateAcademicYearData = async (academic_year_id, academicYearData) => {
    const selectedAcademicYear = await AcademicYears.findByPk(academic_year_id);
    if (!selectedAcademicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    if (academicYearData.year_name && academicYearData.year_name !== selectedAcademicYear.year_name) {
        const existedYearName = await AcademicYears.findOne({ where: { year_name: academicYearData.year_name } });
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

    await selectedAcademicYear.update(academicYearData);

    return selectedAcademicYear;
};

const DeleteAcademicYearData = async (academic_year_id) => {
    const selectedAcademicYear = await AcademicYears.findByPk(academic_year_id);
    if (!selectedAcademicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedAcademicYear.destroy();
};

module.exports = {
    GetAcademicYearData,
    SelectedAcademicYearData,
    CreateAcademicYearData,
    UpdateAcademicYearData,
    DeleteAcademicYearData
};
