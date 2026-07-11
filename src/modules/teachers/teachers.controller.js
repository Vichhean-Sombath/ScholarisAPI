const { GetTeacherData, UpdateTeacherData, SelectTeacherData } = require('./teachers.service');

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
        const selectedTeacher = await SelectTeacherData(req.params.id);
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
        const teacherData = await UpdateTeacherData(req.params.id, req.body, req.user);
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
