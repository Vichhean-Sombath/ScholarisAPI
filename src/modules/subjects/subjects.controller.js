const { GetSubjectData, SelectedSubjectData, CreateSubjectData, UpdateSubjectData, DeleteSubjectData } = require('./subjects.service');
const { ValidationCreateSubject, ValidationUpdateSubject } = require('./subjects.validation')

const GetSubject = async (req, res) => {
    try {
        const subjectData = await GetSubjectData();

        res.status(200).json({
                message: 'Subject retrieved successfully!',
                data: subjectData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectSubject = async (req, res) => {
    try {
        const subjectData = await SelectedSubjectData(req.params.id);

        res.status(200).json({
                message: 'Subject retrieved successfully!',
                data: subjectData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateSubject = async (req, res) => {
    try {
        const validation = ValidationCreateSubject(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const subjectData = await CreateSubjectData(req.body);

        res.status(201).json({
            message: 'Created subject successfully!',
            data: subjectData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateSubject = async (req, res) => {
    try {
        const validation = ValidationUpdateSubject(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });    
        }

        const subjectData = await UpdateSubjectData(req.params.id, req.body);
        
        res.status(200).json({
            message: 'Updated subject successfully!',
            data: subjectData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteSubject = async (req, res) => {
    try {
        const subjectData = await DeleteSubjectData(req.params.id);
        res.status(200).json({
                message: 'Deleted subject successfully!'
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
    GetSubject,
    SelectSubject,
    CreateSubject,
    UpdateSubject,
    DeleteSubject
}