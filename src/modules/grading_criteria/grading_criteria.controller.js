const { GetGradingCriteriaData, SelectedGradingCriteriaData, CreateGradingCriteriaData, UpdateGradingCriteriaData, DeleteGradingCriteriaData } = require('./grading_criteria.service');
const { ValidationCreateGradingCriteria, ValidationUpdateGradingCriteria } = require('./grading_criteria.validation')

const GetGradingCriteria = async (req, res, next) => {
    try {
        const gradingCriteriaData = await GetGradingCriteriaData();

        res.status(200).json({
                message: 'Grading criteria retrieved successfully!',
                data: gradingCriteriaData
            });
    } catch (error) {
        next(error);
    }
}

const SelectGradingCriteria = async (req, res, next) => {
    try {
        const gradingCriteriaData = await SelectedGradingCriteriaData(req.params.id);

        res.status(200).json({
                message: 'Grading criteria retrieved successfully!',
                data: gradingCriteriaData
            });
    } catch (error) {
        next(error);
    }
}

const CreateGradingCriteria = async (req, res, next) => {
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
            message: 'Grading criteria created successfully!',
            data: gradingCriteriaData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateGradingCriteria = async (req, res, next) => {
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
            message: 'Grading criteria updated successfully!',
            data: gradingCriteriaData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteGradingCriteria = async (req, res, next) => {
    try {
        await DeleteGradingCriteriaData(req.params.id);
        res.status(200).json({
                message: 'Grading criteria deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetGradingCriteria,
    SelectGradingCriteria,
    CreateGradingCriteria,
    UpdateGradingCriteria,
    DeleteGradingCriteria
}
