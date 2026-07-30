const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const {
    GetAttendanceRecord,
    SelectAttendanceRecord,
    CreateAttendanceRecord,
    UpdateAttendanceRecord,
    DeleteAttendanceRecord
} = require('./attendance_records.controller');

const AttendanceRecordController = app => {
    app.get('/attendance-record/data', AccessToken, Authorize('Admin', 'Teacher'), GetAttendanceRecord);
    app.get('/attendance-record/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectAttendanceRecord);
    app.post('/attendance-record/create', AccessToken, Authorize('Admin', 'Teacher'), CreateAttendanceRecord);
    app.put('/attendance-record/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateAttendanceRecord);
    app.delete('/attendance-record/delete/:id', AccessToken, Authorize('Admin', 'Teacher'), DeleteAttendanceRecord);
};

module.exports = AttendanceRecordController;
