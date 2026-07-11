const { GetFinalGradeData, SelectedFinalGradeData, CreateFinalGradeData, UpdateFinalGradeData, DeleteFinalGradeData } = require('./final_grades.service');
const { ValidationCreateFinalGrade, ValidationUpdateFinalGrade } = require('./final_grades.validation')

const GetFinalGrade = async (req, res, next) => {
    try {
        const finalGradeData = await GetFinalGradeData();

        res.status(200).json({
                message: 'Final grade retrieved successfully!',
                data: finalGradeData
            });
    } catch (error) {
        next(error);
    }
}

const SelectFinalGrade = async (req, res, next) => {
    try {
        const finalGradeData = await SelectedFinalGradeData(req.params.id);

        res.status(200).json({
                message: 'Final grade retrieved successfully!',
                data: finalGradeData
            });
    } catch (error) {
        next(error);
    }
}

const CreateFinalGrade = async (req, res, next) => {
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
            message: 'Final grade created successfully!',
            data: finalGradeData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateFinalGrade = async (req, res, next) => {
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
            message: 'Final grade updated successfully!',
            data: finalGradeData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteFinalGrade = async (req, res, next) => {
    try {
        await DeleteFinalGradeData(req.params.id);
        res.status(200).json({
                message: 'Final grade deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetFinalGrade,
    SelectFinalGrade,
    CreateFinalGrade,
    UpdateFinalGrade,
    DeleteFinalGrade
}
