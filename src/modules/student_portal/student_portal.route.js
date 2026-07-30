const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const {
    GetStudentSummary,
    GetStudentClasses,
    GetStudentSchedule,
    GetStudentGrades,
    GetStudentAttendance,
    GetStudentInvoices,
    GetStudentCertificates,
    GetStudentResources,
    GetStudentProfile,
    CheckInAttendance,
} = require('./student_portal.controller');

const StudentPortalController = (app) => {
    app.get('/student/me/summary', AccessToken, Authorize('Student'), GetStudentSummary);
    app.get('/student/me/classes', AccessToken, Authorize('Student'), GetStudentClasses);
    app.get('/student/me/schedule', AccessToken, Authorize('Student'), GetStudentSchedule);
    app.get('/student/me/grades', AccessToken, Authorize('Student'), GetStudentGrades);
    app.get('/student/me/attendance', AccessToken, Authorize('Student'), GetStudentAttendance);
    app.post('/student/me/attendance/checkin', AccessToken, Authorize('Student'), CheckInAttendance);
    app.get('/student/me/invoices', AccessToken, Authorize('Student'), GetStudentInvoices);
    app.get('/student/me/certificates', AccessToken, Authorize('Student'), GetStudentCertificates);
    app.get('/student/me/resources', AccessToken, Authorize('Student'), GetStudentResources);
    app.get('/student/me/profile', AccessToken, Authorize('Student'), GetStudentProfile);
};

module.exports = StudentPortalController;
