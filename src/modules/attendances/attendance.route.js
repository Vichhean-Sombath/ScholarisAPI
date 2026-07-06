const { GetAttendanceByClassSubject, MarkAttendance, GenerateQR, ScanQR, GetAttendanceSummary } = require('./attendance.controller');
const AccessToken = require('../../middleware/authenticate');

const AttendanceController = (app) => {
    app.get('/attendance/class-subject/:classSubjectID', AccessToken, GetAttendanceByClassSubject);
    app.post('/attendance/mark', AccessToken, MarkAttendance);
    app.post('/attendance/qr/generate', AccessToken, GenerateQR);
    app.post('/attendance/qr/scan', AccessToken, ScanQR);
    app.get('/attendance/class-subject/:classSubjectID/summary', AccessToken, GetAttendanceSummary);
};

module.exports = AttendanceController;