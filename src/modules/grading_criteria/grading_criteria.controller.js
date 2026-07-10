const { GetGradingCriteriaData, SelectedGradingCriteriaData, CreateGradingCriteriaData, UpdateGradingCriteriaData, DeleteGradingCriteriaData } = require('./grading_criteria.service');
const { ValidationCreateGradingCriteria, ValidationUpdateGradingCriteria } = require('./grading_criteria.validation')

const GetGradingCriteria = async (req, res) => {
    try {
        const gradingCriteriaData = await GetGradingCriteriaData();

        res.status(200).json({
                message: 'Grading criteria retrieved successfully!',
                data: gradingCriteriaData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectGradingCriteria = async (req, res) => {
    try {
        const gradingCriteriaData = await SelectedGradingCriteriaData(req.params.id);

        res.status(200).json({
                message: 'Grading criteria retrieved successfully!',
                data: gradingCriteriaData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateGradingCriteria = async (req, res) => {
    try {
        const validation = ValidationCreateGradingCriteria(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const gradingCriteriaData = await CreateGradingCriteriaData(req.body);

        res.status(201).json({
            message: 'Created grading criteria successfully!',
            data: gradingCriteriaData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateGradingCriteria = async (req, res) => {
    try {
        const validation = ValidationUpdateGradingCriteria(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const gradingCriteriaData = await UpdateGradingCriteriaData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated grading criteria successfully!',
            data: gradingCriteriaData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteGradingCriteria = async (req, res) => {
    try {
        await DeleteGradingCriteriaData(req.params.id);
        res.status(200).json({
                message: 'Deleted grading criteria successfully!'
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
    GetGradingCriteria,
    SelectGradingCriteria,
    CreateGradingCriteria,
    UpdateGradingCriteria,
    DeleteGradingCriteria
}
