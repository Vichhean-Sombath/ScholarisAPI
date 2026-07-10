// Dependencies
const express = require('express');
const cors = require('cors');
const UserController = require('./src/modules/users/users.route');
const AuthController = require('./src/modules/auth/auth.route');
const StudentController = require('./src/modules/students/students.route');
const TeacherController = require('./src/modules/teachers/teachers.route');
const ClassController = require('./src/modules/classes/classes.route');
const SubjectController = require('./src/modules/subjects/subjects.route');
const CertificateController = require('./src/modules/certificates/certificates.route');
const EmergencyContactController = require('./src/modules/student_emergency_contacts/student_emergency_contacts.route');
const ClassEnrollmentController = require('./src/modules/class_enrollments/class_enrollments.route');
const AttendanceRecordController = require('./src/modules/attendance_records/attendance_records.route');

// Sync DB
const sequelize = require('./src/config/db');
sequelize.sync({ alter: true })
    .then(() => console.log('Database updated!'))
    .catch((err) => console.log('Database sync error: ', err));

// Models
const {
    Users,
    Teachers,
    Students,
    StudentEmergencyContacts,
    AcademicYears,
    Semesters,
    Subjects,
    Classes,
    ClassEnrollments,
    TimeSlots,
    Schedules,
    AttendanceRecords,
    GradingCriteria,
    Assessments,
    Grades,
    FinalGrades,
    FeeStructures,
    Invoices,
    Payments,
    Certificates,
    LessonResources
} = require('./src/models/mappingContext');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
UserController(app);
AuthController(app);
StudentController(app);
TeacherController(app);
ClassController(app);
SubjectController(app);
CertificateController(app);
EmergencyContactController(app);
ClassEnrollmentController(app);
AttendanceRecordController(app);

app.listen(3000, () => console.log('Server is listening on port 3000!'));