const { GetGradeData, SelectedGradeData, CreateGradeData, UpdateGradeData, DeleteGradeData } = require('./grades.service');
const { ValidationCreateGrade, ValidationUpdateGrade } = require('./grades.validation')

const GetGrade = async (req, res, next) => {
    try {
        const assessmentId = req.query.assessment_id ? parseInt(req.query.assessment_id, 10) : null;
        const gradeData = await GetGradeData(req.user, assessmentId);

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            });
    } catch (error) {
        next(error);
    }
}

const SelectGrade = async (req, res, next) => {
    try {
        const gradeData = await SelectedGradeData(req.params.id, req.user);

        res.status(200).json({
                message: 'Grade retrieved successfully!',
                data: gradeData
            });
    } catch (error) {
        next(error);
    }
}

const CreateGrade = async (req, res, next) => {
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
        next(error);
    }
}

const UpdateGrade = async (req, res, next) => {
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
        next(error);
    }
}

const DeleteGrade = async (req, res, next) => {
    try {
        await DeleteGradeData(req.params.id, req.user);
        res.status(200).json({
                message: 'Grade deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetGrade,
    SelectGrade,
    CreateGrade,
    UpdateGrade,
    DeleteGrade
}
