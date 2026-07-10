const { GetFinalGradeData, SelectedFinalGradeData, CreateFinalGradeData, UpdateFinalGradeData, DeleteFinalGradeData } = require('./final_grades.service');
const { ValidationCreateFinalGrade, ValidationUpdateFinalGrade } = require('./final_grades.validation')

const GetFinalGrade = async (req, res) => {
    try {
        const finalGradeData = await GetFinalGradeData();

        res.status(200).json({
                message: 'Final grade retrieved successfully!',
                data: finalGradeData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectFinalGrade = async (req, res) => {
    try {
        const finalGradeData = await SelectedFinalGradeData(req.params.id);

        res.status(200).json({
                message: 'Final grade retrieved successfully!',
                data: finalGradeData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateFinalGrade = async (req, res) => {
    try {
        const validation = ValidationCreateFinalGrade(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const finalGradeData = await CreateFinalGradeData(req.body);

        res.status(201).json({
            message: 'Created final grade successfully!',
            data: finalGradeData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateFinalGrade = async (req, res) => {
    try {
        const validation = ValidationUpdateFinalGrade(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const finalGradeData = await UpdateFinalGradeData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated final grade successfully!',
            data: finalGradeData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteFinalGrade = async (req, res) => {
    try {
        await DeleteFinalGradeData(req.params.id);
        res.status(200).json({
                message: 'Deleted final grade successfully!'
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
    GetFinalGrade,
    SelectFinalGrade,
    CreateFinalGrade,
    UpdateFinalGrade,
    DeleteFinalGrade
}
