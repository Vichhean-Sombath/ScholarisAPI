const { GetFeeStructureData, SelectedFeeStructureData, CreateFeeStructureData, UpdateFeeStructureData, DeleteFeeStructureData } = require('./fee_structures.service');
const { ValidationCreateFeeStructure, ValidationUpdateFeeStructure } = require('./fee_structures.validation')

const GetFeeStructure = async (req, res, next) => {
    try {
        const feeStructureData = await GetFeeStructureData();

        res.status(200).json({
                message: 'Fee structure retrieved successfully!',
                data: feeStructureData
            });
    } catch (error) {
        next(error);
    }
}

const SelectFeeStructure = async (req, res, next) => {
    try {
        const feeStructureData = await SelectedFeeStructureData(req.params.id);

        res.status(200).json({
                message: 'Fee structure retrieved successfully!',
                data: feeStructureData
            });
    } catch (error) {
        next(error);
    }
}

const CreateFeeStructure = async (req, res, next) => {
    try {
        const validation = ValidationCreateFeeStructure(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const { feeStructure, invoicesGenerated } = await CreateFeeStructureData(req.body);

        res.status(201).json({
            message: invoicesGenerated > 0
                ? `Fee structure created successfully! ${invoicesGenerated} invoice(s) generated.`
                : 'Fee structure created successfully!',
            data: {
                ...feeStructure.toJSON(),
                invoicesGenerated
            }
        });
    } catch (error) {
        next(error);
    }
}

const UpdateFeeStructure = async (req, res, next) => {
    try {
        const validation = ValidationUpdateFeeStructure(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const { feeStructure, invoicesGenerated } = await UpdateFeeStructureData(req.params.id, req.body);

        res.status(200).json({
            message: invoicesGenerated > 0
                ? `Fee structure updated successfully! ${invoicesGenerated} invoice(s) generated.`
                : 'Fee structure updated successfully!',
            data: {
                ...feeStructure.toJSON(),
                invoicesGenerated
            }
        });
    } catch (error) {
        next(error);
    }
}

const DeleteFeeStructure = async (req, res, next) => {
    try {
        await DeleteFeeStructureData(req.params.id);
        res.status(200).json({
                message: 'Fee structure deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetFeeStructure,
    SelectFeeStructure,
    CreateFeeStructure,
    UpdateFeeStructure,
    DeleteFeeStructure
}
