const { GetStudentData, UpdateStudentData, SelectStudentData } = require('./students.service');
const { ValidationUpdateStudent } = require('./students.validation');

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
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Student ID must be a number.' });
        }

        const selectedStudent = await SelectStudentData(id);
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
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Student ID must be a number.' });
        }

        const validation = ValidationUpdateStudent(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const studentData = await UpdateStudentData(id, req.body);
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
