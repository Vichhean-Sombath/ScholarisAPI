const {
    GetAttendanceRecordData,
    SelectedAttendanceRecordData,
    CreateAttendanceRecordData,
    UpdateAttendanceRecordData,
    DeleteAttendanceRecordData
} = require('./attendance_records.service');
const { ValidationCreateAttendanceRecord, ValidationUpdateAttendanceRecord } = require('./attendance_records.validation');

const GetAttendanceRecord = async (req, res, next) => {
    try {
        const recordData = await GetAttendanceRecordData(req.user);

        res.status(200).json({
            message: 'Attendance records retrieved successfully!',
            data: recordData
        });
    } catch (error) {
        next(error);
    }
};

const SelectAttendanceRecord = async (req, res, next) => {
    try {
        const recordData = await SelectedAttendanceRecordData(req.params.id, req.user);

        res.status(200).json({
            message: 'Attendance record retrieved successfully!',
            data: recordData
        });
    } catch (error) {
        next(error);
    }
};

const CreateAttendanceRecord = async (req, res, next) => {
    try {
        const validation = ValidationCreateAttendanceRecord(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const recordData = await CreateAttendanceRecordData(req.body, req.user);

        res.status(201).json({
            message: 'Attendance record created successfully!',
            data: recordData
        });
    } catch (error) {
        next(error);
    }
};

const UpdateAttendanceRecord = async (req, res, next) => {
    try {
        const validation = ValidationUpdateAttendanceRecord(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const recordData = await UpdateAttendanceRecordData(req.params.id, req.body, req.user);

        res.status(200).json({
            message: 'Attendance record updated successfully!',
            data: recordData
        });
    } catch (error) {
        next(error);
    }
};

const DeleteAttendanceRecord = async (req, res, next) => {
    try {
        await DeleteAttendanceRecordData(req.params.id, req.user);

        res.status(200).json({
            message: 'Attendance record deleted successfully!'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetAttendanceRecord,
    SelectAttendanceRecord,
    CreateAttendanceRecord,
    UpdateAttendanceRecord,
    DeleteAttendanceRecord
};
