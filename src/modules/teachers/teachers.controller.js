const { GetTeacherData, UpdateTeacherData, SelectTeacherData } = require('./teachers.service');
const { ValidationUpdateTeacher } = require('./teachers.validation');

const GetTeacher = async (req, res, next) => {
    try {
        const teacherData = await GetTeacherData();
        res.status(200).json({
            message: 'Teachers retrieved successfully!',
            data: teacherData
        });
    } catch (error) {
        next(error);
    }
};

const SelectTeacher = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Teacher ID must be a number.' });
        }

        const selectedTeacher = await SelectTeacherData(id);
        res.status(200).json({
            message: 'Teacher retrieved successfully!',
            data: selectedTeacher
        });
    } catch (error) {
        next(error);
    }
};

const UpdateTeacher = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Teacher ID must be a number.' });
        }

        const validation = ValidationUpdateTeacher(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const teacherData = await UpdateTeacherData(id, req.body, req.user);
        res.status(200).json({
            message: 'Teacher updated successfully!',
            data: teacherData
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetTeacher,
    SelectTeacher,
    UpdateTeacher
};
