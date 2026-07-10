const { GetFeeStructureData, SelectedFeeStructureData, CreateFeeStructureData, UpdateFeeStructureData, DeleteFeeStructureData } = require('./fee_structures.service');
const { ValidationCreateFeeStructure, ValidationUpdateFeeStructure } = require('./fee_structures.validation')

const GetFeeStructure = async (req, res) => {
    try {
        const feeStructureData = await GetFeeStructureData();

        res.status(200).json({
                message: 'Fee structure retrieved successfully!',
                data: feeStructureData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectFeeStructure = async (req, res) => {
    try {
        const feeStructureData = await SelectedFeeStructureData(req.params.id);

        res.status(200).json({
                message: 'Fee structure retrieved successfully!',
                data: feeStructureData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateFeeStructure = async (req, res) => {
    try {
        const validation = ValidationCreateFeeStructure(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const feeStructureData = await CreateFeeStructureData(req.body);

        res.status(201).json({
            message: 'Created fee structure successfully!',
            data: feeStructureData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateFeeStructure = async (req, res) => {
    try {
        const validation = ValidationUpdateFeeStructure(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const feeStructureData = await UpdateFeeStructureData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated fee structure successfully!',
            data: feeStructureData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteFeeStructure = async (req, res) => {
    try {
        await DeleteFeeStructureData(req.params.id);
        res.status(200).json({
                message: 'Deleted fee structure successfully!'
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
    GetFeeStructure,
    SelectFeeStructure,
    CreateFeeStructure,
    UpdateFeeStructure,
    DeleteFeeStructure
}
