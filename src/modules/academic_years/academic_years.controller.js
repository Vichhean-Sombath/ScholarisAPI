const { GetAcademicYearData, SelectedAcademicYearData, CreateAcademicYearData, UpdateAcademicYearData, DeleteAcademicYearData } = require('./academic_years.service');
const { ValidationCreateAcademicYear, ValidationUpdateAcademicYear } = require('./academic_years.validation')

const GetAcademicYear = async (req, res) => {
    try {
        const academicYearData = await GetAcademicYearData();

        res.status(200).json({
                message: 'Academic year retrieved successfully!',
                data: academicYearData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectAcademicYear = async (req, res) => {
    try {
        const academicYearData = await SelectedAcademicYearData(req.params.id);

        res.status(200).json({
                message: 'Academic year retrieved successfully!',
                data: academicYearData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateAcademicYear = async (req, res) => {
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
            message: 'Created academic year successfully!',
            data: academicYearData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateAcademicYear = async (req, res) => {
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
            message: 'Updated academic year successfully!',
            data: academicYearData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteAcademicYear = async (req, res) => {
    try {
        await DeleteAcademicYearData(req.params.id);
        res.status(200).json({
                message: 'Deleted academic year successfully!'
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

module.exports = {
    GetAcademicYear,
    SelectAcademicYear,
    CreateAcademicYear,
    UpdateAcademicYear,
    DeleteAcademicYear
}
