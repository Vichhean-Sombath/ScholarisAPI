const {
    GetAttendanceRecordData,
    SelectedAttendanceRecordData,
    CreateAttendanceRecordData,
    UpdateAttendanceRecordData,
    DeleteAttendanceRecordData
} = require('./attendance_records.service');
const { ValidationCreateAttendanceRecord, ValidationUpdateAttendanceRecord } = require('./attendance_records.validation');

const GetAttendanceRecord = async (req, res) => {
    try {
        const recordData = await GetAttendanceRecordData();

        res.status(200).json({
            message: 'Attendance records retrieved successfully!',
            data: recordData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        });
    }
};

const SelectAttendanceRecord = async (req, res) => {
    try {
        const recordData = await SelectedAttendanceRecordData(req.params.id);

        res.status(200).json({
            message: 'Attendance record retrieved successfully!',
            data: recordData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        });
    }
};

const CreateAttendanceRecord = async (req, res) => {
    try {
        const validation = ValidationCreateAttendanceRecord(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const recordData = await CreateAttendanceRecordData(req.body);

        res.status(201).json({
            message: 'Created attendance record successfully!',
            data: recordData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        });
    }
};

const UpdateAttendanceRecord = async (req, res) => {
    try {
        const validation = ValidationUpdateAttendanceRecord(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const recordData = await UpdateAttendanceRecordData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated attendance record successfully!',
            data: recordData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        });
    }
};

const DeleteAttendanceRecord = async (req, res) => {
    try {
        await DeleteAttendanceRecordData(req.params.id);

        res.status(200).json({
            message: 'Deleted attendance record successfully!'
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        });
    }
};

module.exports = {
    GetAttendanceRecord,
    SelectAttendanceRecord,
    CreateAttendanceRecord,
    UpdateAttendanceRecord,
    DeleteAttendanceRecord
};
