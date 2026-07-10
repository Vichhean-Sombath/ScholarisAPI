const { GetTeacherData, UpdateTeacherData, SelectTeacherData } = require('./teachers.service');

const GetTeacher = async (req, res) => {
    try {
        const teacherData = await GetTeacherData();
        res.status(200).json({
            message: 'Teachers retrieved successfully!',
            data: teacherData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const SelectTeacher = async (req, res) => {
    try {
        const selectedTeacher = await SelectTeacherData(req.params.id);
        res.status(200).json({
            message: 'Teacher retrieved successfully!',
            data: selectedTeacher
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const UpdateTeacher = async (req, res) => {
    try {
        const teacherData = await UpdateTeacherData(req.params.id, req.body, req.user);
        res.status(200).json({
            message: 'Teacher updated successfully!',
            data: teacherData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

module.exports = {
    GetTeacher,
    SelectTeacher,
    UpdateTeacher
};
