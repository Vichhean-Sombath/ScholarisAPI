const Students = require('../../models/students.model');
const { GetStudentData, UpdateStudentData, SelectStudentData } = require('./students.service');

// Get
const GetStudent = async (req, res) => {
    try {
        const studentData = await GetStudentData();
        res.status(200).json({
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

// Select
const SelectStudent = async (req, res) => {
    try {
        const selectedStudent = await SelectStudentData(req.params.search);
        res.status(200).json({
            message: 'Student retrieved successfully!',
            data: selectedStudent
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

// Update
const UpdateStudent = async (req, res) => {
    try {
        const studentData = await UpdateStudentData(req.params.id, req.body);
        res.status(200).json({
            message: 'Students updated successfully!',
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
    SelectStudent,
    UpdateStudent
}