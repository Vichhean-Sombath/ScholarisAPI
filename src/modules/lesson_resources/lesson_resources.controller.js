const { GetLessonResourceData, SelectedLessonResourceData, CreateLessonResourceData, UpdateLessonResourceData, DeleteLessonResourceData } = require('./lesson_resources.service');
const { ValidationCreateLessonResource, ValidationUpdateLessonResource } = require('./lesson_resources.validation')

const GetLessonResource = async (req, res) => {
    try {
        const lessonResourceData = await GetLessonResourceData();

        res.status(200).json({
                message: 'Lesson resource retrieved successfully!',
                data: lessonResourceData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    };
}

const SelectLessonResource = async (req, res) => {
    try {
        const lessonResourceData = await SelectedLessonResourceData(req.params.id);

        res.status(200).json({
                message: 'Lesson resource retrieved successfully!',
                data: lessonResourceData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    };
}

const CreateLessonResource = async (req, res) => {
    try {
        const validation = ValidationCreateLessonResource(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const lessonResourceData = await CreateLessonResourceData(req.body);

        res.status(201).json({
            message: 'Lesson resource created successfully!',
            data: lessonResourceData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    };
}

const UpdateLessonResource = async (req, res) => {
    try {
        const validation = ValidationUpdateLessonResource(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const lessonResourceData = await UpdateLessonResourceData(req.params.id, req.body);

        res.status(200).json({
            message: 'Lesson resource updated successfully!',
            data: lessonResourceData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    };
}

const DeleteLessonResource = async (req, res) => {
    try {
        await DeleteLessonResourceData(req.params.id);
        res.status(200).json({
                message: 'Lesson resource deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    };
}

module.exports = {
    GetLessonResource,
    SelectLessonResource,
    CreateLessonResource,
    UpdateLessonResource,
    DeleteLessonResource
}
