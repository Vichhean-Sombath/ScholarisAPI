const { GetSubjectData, SelectedSubjectData, CreateSubjectData, UpdateSubjectData, DeleteSubjectData } = require('./subjects.service');
const { ValidationCreateSubject, ValidationUpdateSubject } = require('./subjects.validation')

const GetSubject = async (req, res, next) => {
    try {
        const subjectData = await GetSubjectData();

        res.status(200).json({
                message: 'Subject retrieved successfully!',
                data: subjectData
            });
    } catch (error) {
        next(error);
    }
}

const SelectSubject = async (req, res, next) => {
    try {
        const subjectData = await SelectedSubjectData(req.params.id);

        res.status(200).json({
                message: 'Subject retrieved successfully!',
                data: subjectData
            });
    } catch (error) {
        next(error);
    }
}

const CreateSubject = async (req, res, next) => {
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
            message: 'Subject created successfully!',
            data: subjectData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateSubject = async (req, res, next) => {
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
            message: 'Subject updated successfully!',
            data: subjectData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteSubject = async (req, res, next) => {
    try {
        const subjectData = await DeleteSubjectData(req.params.id);
        res.status(200).json({
                message: 'Subject deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetSubject,
    SelectSubject,
    CreateSubject,
    UpdateSubject,
    DeleteSubject
}