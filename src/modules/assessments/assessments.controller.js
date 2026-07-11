const { GetAssessmentData, SelectedAssessmentData, CreateAssessmentData, UpdateAssessmentData, DeleteAssessmentData } = require('./assessments.service');
const { ValidationCreateAssessment, ValidationUpdateAssessment } = require('./assessments.validation')

const GetAssessment = async (req, res, next) => {
    try {
        const assessmentData = await GetAssessmentData(req.user);

        res.status(200).json({
                message: 'Assessment retrieved successfully!',
                data: assessmentData
            });
    } catch (error) {
        next(error);
    }
}

const SelectAssessment = async (req, res, next) => {
    try {
        const assessmentData = await SelectedAssessmentData(req.params.id, req.user);

        res.status(200).json({
                message: 'Assessment retrieved successfully!',
                data: assessmentData
            });
    } catch (error) {
        next(error);
    }
}

const CreateAssessment = async (req, res, next) => {
    try {
        const validation = ValidationCreateAssessment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const assessmentData = await CreateAssessmentData(req.body, req.user);

        res.status(201).json({
            message: 'Assessment created successfully!',
            data: assessmentData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateAssessment = async (req, res, next) => {
    try {
        const validation = ValidationUpdateAssessment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const assessmentData = await UpdateAssessmentData(req.params.id, req.body, req.user);

        res.status(200).json({
            message: 'Assessment updated successfully!',
            data: assessmentData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteAssessment = async (req, res, next) => {
    try {
        await DeleteAssessmentData(req.params.id, req.user);
        res.status(200).json({
                message: 'Assessment deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetAssessment,
    SelectAssessment,
    CreateAssessment,
    UpdateAssessment,
    DeleteAssessment
}
