const { GetStudentData } = require('./students.service');

const GetStudent = async (req, res) => {
    try {
        const studentData = await GetStudentData();
        res.status(201).json({
            message: 'Students retrieved successfully!',
            data: studentData
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
    GetStudent,
}