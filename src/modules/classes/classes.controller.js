const { GetClassData, SelectedClassData, CreateClassData, UpdateClassData, DeleteClassData } = require('./classes.service');
const { ValidationCreateClass, ValidationUpdateClass } = require('./classes.validation')

const GetClass = async (req, res, next) => {
    try {
        const classData = await GetClassData(req.user);

        res.status(200).json({
                message: 'Class retrieved successfully!',
                data: classData
            });
    } catch (error) {
        next(error);
    }
}

const SelectClass = async (req, res, next) => {
    try {
        const classData = await SelectedClassData(req.params.id);

        res.status(200).json({
                message: 'Class retrieved successfully!',
                data: classData
            });
    } catch (error) {
        next(error);
    }
}

const CreateClass = async (req, res, next) => {
    try {
        const validation = ValidationCreateClass(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const classData = await CreateClassData(req.body);

        res.status(201).json({
            message: 'Class created successfully!',
            data: classData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateClass = async (req, res, next) => {
    try {
        const validation = ValidationUpdateClass(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });    
        }

        const classData = await UpdateClassData(req.params.id, req.body);
        
        res.status(200).json({
            message: 'Class updated successfully!',
            data: classData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteClass = async (req, res, next) => {
    try {
        const classData = await DeleteClassData(req.params.id);
        res.status(200).json({
                message: 'Class deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetClass,
    SelectClass,
    CreateClass,
    UpdateClass,
    DeleteClass
}