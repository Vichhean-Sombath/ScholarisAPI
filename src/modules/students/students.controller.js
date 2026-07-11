const { GetStudentData, UpdateStudentData, SelectStudentData } = require('./students.service');

const GetStudent = async (req, res, next) => {
    try {
        const studentData = await GetStudentData();
        res.status(200).json({
            message: 'Students retrieved successfully!',
            data: studentData
        });
    } catch (error) {
        next(error);
    }
};

const SelectStudent = async (req, res, next) => {
    try {
        const selectedStudent = await SelectStudentData(req.params.id);
        res.status(200).json({
            message: 'Student retrieved successfully!',
            data: selectedStudent
        });
    } catch (error) {
        next(error);
    }
};

const UpdateStudent = async (req, res, next) => {
    try {
        const studentData = await UpdateStudentData(req.params.id, req.body);
        res.status(200).json({
            message: 'Student updated successfully!',
            data: studentData
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetStudent,
    SelectStudent,
    UpdateStudent
};
