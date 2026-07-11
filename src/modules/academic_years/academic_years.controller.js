const { GetAcademicYearData, SelectedAcademicYearData, CreateAcademicYearData, UpdateAcademicYearData, DeleteAcademicYearData } = require('./academic_years.service');
const { ValidationCreateAcademicYear, ValidationUpdateAcademicYear } = require('./academic_years.validation')

const GetAcademicYear = async (req, res, next) => {
    try {
        const academicYearData = await GetAcademicYearData();

        res.status(200).json({
                message: 'Academic year retrieved successfully!',
                data: academicYearData
            });
    } catch (error) {
        next(error);
    }
}

const SelectAcademicYear = async (req, res, next) => {
    try {
        const academicYearData = await SelectedAcademicYearData(req.params.id);

        res.status(200).json({
                message: 'Academic year retrieved successfully!',
                data: academicYearData
            });
    } catch (error) {
        next(error);
    }
}

const CreateAcademicYear = async (req, res, next) => {
    try {
        const validation = ValidationCreateAcademicYear(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const academicYearData = await CreateAcademicYearData(req.body);

        res.status(201).json({
            message: 'Academic year created successfully!',
            data: academicYearData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateAcademicYear = async (req, res, next) => {
    try {
        const validation = ValidationUpdateAcademicYear(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const academicYearData = await UpdateAcademicYearData(req.params.id, req.body);

        res.status(200).json({
            message: 'Academic year updated successfully!',
            data: academicYearData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteAcademicYear = async (req, res, next) => {
    try {
        await DeleteAcademicYearData(req.params.id);
        res.status(200).json({
                message: 'Academic year deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetAcademicYear,
    SelectAcademicYear,
    CreateAcademicYear,
    UpdateAcademicYear,
    DeleteAcademicYear
}
