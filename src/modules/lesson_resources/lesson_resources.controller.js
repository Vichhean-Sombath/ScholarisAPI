const { GetLessonResourceData, SelectedLessonResourceData, CreateLessonResourceData, UpdateLessonResourceData, DeleteLessonResourceData } = require('./lesson_resources.service');
const { ValidationCreateLessonResource, ValidationUpdateLessonResource } = require('./lesson_resources.validation')

const GetLessonResource = async (req, res, next) => {
    try {
        const lessonResourceData = await GetLessonResourceData(req.user);

        res.status(200).json({
                message: 'Lesson resource retrieved successfully!',
                data: lessonResourceData
            });
    } catch (error) {
        next(error);
    };
}

const SelectLessonResource = async (req, res, next) => {
    try {
        const lessonResourceData = await SelectedLessonResourceData(req.params.id, req.user);

        res.status(200).json({
                message: 'Lesson resource retrieved successfully!',
                data: lessonResourceData
            });
    } catch (error) {
        next(error);
    };
}

const CreateLessonResource = async (req, res, next) => {
    try {
        const validation = ValidationCreateLessonResource(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const lessonResourceData = await CreateLessonResourceData(req.body, req.user);

        res.status(201).json({
            message: 'Lesson resource created successfully!',
            data: lessonResourceData
        });
    } catch (error) {
        next(error);
    };
}

const UpdateLessonResource = async (req, res, next) => {
    try {
        const validation = ValidationUpdateLessonResource(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const lessonResourceData = await UpdateLessonResourceData(req.params.id, req.body, req.user);

        res.status(200).json({
            message: 'Lesson resource updated successfully!',
            data: lessonResourceData
        });
    } catch (error) {
        next(error);
    };
}

const DeleteLessonResource = async (req, res, next) => {
    try {
        await DeleteLessonResourceData(req.params.id, req.user);
        res.status(200).json({
                message: 'Lesson resource deleted successfully!'
            });
    } catch (error) {
        next(error);
    };
}

module.exports = {
    GetLessonResource,
    SelectLessonResource,
    CreateLessonResource,
    UpdateLessonResource,
    DeleteLessonResource
}
