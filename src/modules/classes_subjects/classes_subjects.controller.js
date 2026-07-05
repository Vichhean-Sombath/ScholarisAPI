const { GetClassSubjectData, SelectClassSubjectData, CreateSubjectClassData, DeleteClassSubjectData } = require('./classes_subjects.service');
const { ValidationCreateClassSubject } = require('./classes_subjects.validation');

const GetClassSubject = async (req, res) => {
    try {
        const classSubject = await GetClassSubjectData();
    
        res.status(200).json({
            message: 'Class Subject retrieved successfully!',
            data: classSubject
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectClassSubject = async (req, res) => {
    try {
        const classSubject = await SelectClassSubjectData(req.params.id);
    
        res.status(200).json({
            message: 'Class Subject retrieved successfully!',
            data: classSubject
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateClassSubject = async (req, res) => {
    try {
        const validation = ValidationCreateClassSubject(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error,
            });
        }

        const classSubjectData = await CreateSubjectClassData(req.body);

        res.status(201).json({
            message: 'Class Subject created successfully!',
            data: classSubjectData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteClassSubject = async (req, res) => {
    try {
        await DeleteClassSubjectData(req.params.id);

        res.status(200).json({
        message: 'Deleted class subject successfully!',
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
        message: error.message || 'Internal server error!',
        error: error.statusCode ? null : error.message,
        });
    }
};

module.exports = {
    GetClassSubject,
    SelectClassSubject,
    CreateClassSubject,
    DeleteClassSubject
}