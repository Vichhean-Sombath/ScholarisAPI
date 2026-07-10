const { GetGradeData, SelectedGradeData, CreateGradeData, UpdateGradeData, DeleteGradeData } = require('./grades.service');
const { ValidationCreateGrade, ValidationUpdateGrade } = require('./grades.validation')

const GetGrade = async (req, res) => {
    try {
        const gradeData = await GetGradeData(req.user);

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectGrade = async (req, res) => {
    try {
        const gradeData = await SelectedGradeData(req.params.id, req.user);

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
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

        const gradeData = await CreateGradeData(req.body, req.user);

        res.status(201).json({
            message: 'Grade created successfully!',
            data: gradeData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
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

        const gradeData = await UpdateGradeData(req.params.id, req.body, req.user);

        res.status(200).json({
            message: 'Grade updated successfully!',
            data: gradeData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeleteGrade = async (req, res) => {
    try {
        await DeleteGradeData(req.params.id, req.user);
        res.status(200).json({
                message: 'Grade deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetGrade,
    SelectGrade,
    CreateGrade,
    UpdateGrade,
    DeleteGrade
}
