const { GetClassData, SelectedClassData, CreateClassData, UpdateClassData, DeleteClassData } = require('./classes.service');
const { ValidationCreateClass, ValidationUpdateClass } = require('./classes.validation')

const GetClass = async (req, res) => {
    try {
        const classData = await GetClassData();

        res.status(200).json({
                message: 'Class retrieved successfully!',
                data: classData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectClass = async (req, res) => {
    try {
        const classData = await SelectedClassData(req.params.id);

        res.status(200).json({
                message: 'Class retrieved successfully!',
                data: classData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateClass = async (req, res) => {
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
            message: 'Created class successfully!',
            data: classData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateClass = async (req, res) => {
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
            message: 'Updated class successfully!',
            data: classData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteClass = async (req, res) => {
    try {
        const classData = await DeleteClassData(req.params.id);
        res.status(200).json({
                message: 'Deleted class successfully!'
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
    GetClass,
    SelectClass,
    CreateClass,
    UpdateClass,
    DeleteClass
}