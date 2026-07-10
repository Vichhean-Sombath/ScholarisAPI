const { GetGradeData, SelectedGradeData, CreateGradeData, UpdateGradeData, DeleteGradeData } = require('./grades.service');
const { ValidationCreateGrade, ValidationUpdateGrade } = require('./grades.validation')

const GetGrade = async (req, res) => {
    try {
        const gradeData = await GetGradeData();

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectGrade = async (req, res) => {
    try {
        const gradeData = await SelectedGradeData(req.params.id);

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateGrade = async (req, res) => {
    try {
        const validation = ValidationCreateGrade(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const gradeData = await CreateGradeData(req.body);

        res.status(201).json({
            message: 'Created grade successfully!',
            data: gradeData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateGrade = async (req, res) => {
    try {
        const validation = ValidationUpdateGrade(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const gradeData = await UpdateGradeData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated grade successfully!',
            data: gradeData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteGrade = async (req, res) => {
    try {
        await DeleteGradeData(req.params.id);
        res.status(200).json({
                message: 'Deleted grade successfully!'
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
    GetGrade,
    SelectGrade,
    CreateGrade,
    UpdateGrade,
    DeleteGrade
}
