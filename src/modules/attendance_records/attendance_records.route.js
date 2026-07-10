const AccessToken = require('../../middleware/authenticate');
const {
    GetAttendanceRecord,
    SelectAttendanceRecord,
    CreateAttendanceRecord,
    UpdateAttendanceRecord,
    DeleteAttendanceRecord
} = require('./attendance_records.controller');

const AttendanceRecordController = app => {
    app.get('/attendance-record/data', AccessToken, GetAttendanceRecord);
    app.get('/attendance-record/data/:id', AccessToken, SelectAttendanceRecord);
    app.post('/attendance-record/create', AccessToken, CreateAttendanceRecord);
    app.put('/attendance-record/update/:id', AccessToken, UpdateAttendanceRecord);
    app.delete('/attendance-record/delete/:id', AccessToken, DeleteAttendanceRecord);
};

module.exports = AttendanceRecordController;
