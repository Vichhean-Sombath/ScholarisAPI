const { GetAssessmentData, SelectedAssessmentData, CreateAssessmentData, UpdateAssessmentData, DeleteAssessmentData } = require('./assessments.service');
const { ValidationCreateAssessment, ValidationUpdateAssessment } = require('./assessments.validation')

const GetAssessment = async (req, res) => {
    try {
        const assessmentData = await GetAssessmentData();

        res.status(200).json({
                message: 'Assessment retrieved successfully!',
                data: assessmentData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectAssessment = async (req, res) => {
    try {
        const assessmentData = await SelectedAssessmentData(req.params.id);

        res.status(200).json({
                message: 'Assessment retrieved successfully!',
                data: assessmentData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateAssessment = async (req, res) => {
    try {
        const validation = ValidationCreateAssessment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const assessmentData = await CreateAssessmentData(req.body);

        res.status(201).json({
            message: 'Created assessment successfully!',
            data: assessmentData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateAssessment = async (req, res) => {
    try {
        const validation = ValidationUpdateAssessment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const assessmentData = await UpdateAssessmentData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated assessment successfully!',
            data: assessmentData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteAssessment = async (req, res) => {
    try {
        await DeleteAssessmentData(req.params.id);
        res.status(200).json({
                message: 'Deleted assessment successfully!'
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
    GetAssessment,
    SelectAssessment,
    CreateAssessment,
    UpdateAssessment,
    DeleteAssessment
}
