const Users = require('./users.model');
const Students = require('./students.model');
const Teachers = require('./teachers.model');
const Subjects = require('./subjects.model');
const Classes = require('./classes.model');
const ClassSubjects = require('./class_subjects.model');
const Payments = require('./payments.model');
const PaymentTransactions = require('./payment_transactions.model');
const PaymentGatewayLogs = require('./payment_gateway_logs.model');
const Attendance = require('./attendance.model');
const AttendanceQR = require('./attendanceQR.model');
const Reports = require('./reports.model');
const Certificates = require('./certificates.model');
const Notifications = require('./notifications.model');

// Users
Users.hasOne(Students, { foreignKey: 'userID', onDelete: 'CASCADE' });
Users.hasOne(Teachers, { foreignKey: 'userID', onDelete: 'CASCADE' });
Users.hasMany(Notifications, { foreignKey: 'userID', onDelete: 'CASCADE' });

Students.belongsTo(Users, { foreignKey: 'userID' });
Teachers.belongsTo(Users, { foreignKey: 'userID' });
Notifications.belongsTo(Users, { foreignKey: 'userID' });

// Students
Students.hasMany(Payments, { foreignKey: 'studentID', onDelete: 'CASCADE' });
Students.hasMany(Certificates, { foreignKey: 'studentID', onDelete: 'CASCADE' });
Students.hasMany(Reports, { foreignKey: 'studentID', onDelete: 'CASCADE' });
Students.hasMany(Attendance, { foreignKey: 'studentID', onDelete: 'CASCADE' });

Payments.belongsTo(Students, { foreignKey: 'studentID' });
Certificates.belongsTo(Students, { foreignKey: 'studentID' });
Reports.belongsTo(Students, { foreignKey: 'studentID' });
Attendance.belongsTo(Students, { foreignKey: 'studentID' });

// Classes / Subjects / ClassSubjects
Classes.hasMany(ClassSubjects, { foreignKey: 'classID', onDelete: 'CASCADE' });
Subjects.hasMany(ClassSubjects, { foreignKey: 'subjectID', onDelete: 'CASCADE' });

ClassSubjects.belongsTo(Classes, { foreignKey: 'classID' });
ClassSubjects.belongsTo(Subjects, { foreignKey: 'subjectID' });

ClassSubjects.hasMany(Attendance, { foreignKey: 'classSubjectID', onDelete: 'CASCADE' });
ClassSubjects.hasMany(Reports, { foreignKey: 'classSubjectID', onDelete: 'CASCADE' });
ClassSubjects.hasMany(AttendanceQR, { foreignKey: 'classSubjectID', onDelete: 'CASCADE' });

Attendance.belongsTo(ClassSubjects, { foreignKey: 'classSubjectID' });
Reports.belongsTo(ClassSubjects, { foreignKey: 'classSubjectID' });
AttendanceQR.belongsTo(ClassSubjects, { foreignKey: 'classSubjectID' });

// Teachers
Teachers.hasMany(AttendanceQR, { foreignKey: 'teacherID', onDelete: 'CASCADE' });
AttendanceQR.belongsTo(Teachers, { foreignKey: 'teacherID' });

// Payments / Transactions / Gateway logs
Payments.hasMany(PaymentTransactions, { foreignKey: 'paymentID', onDelete: 'CASCADE' });
PaymentTransactions.belongsTo(Payments, { foreignKey: 'paymentID' });

PaymentTransactions.hasMany(PaymentGatewayLogs, { foreignKey: 'paymentTransactionID', onDelete: 'CASCADE' });
PaymentGatewayLogs.belongsTo(PaymentTransactions, { foreignKey: 'paymentTransactionID' });

module.exports = {
    Users,
    Students,
    Teachers,
    Subjects,
    Classes,
    ClassSubjects,
    Payments,
    PaymentTransactions,
    PaymentGatewayLogs,
    Attendance,
    AttendanceQR,
    Reports,
    Certificates,
    Notifications
};
