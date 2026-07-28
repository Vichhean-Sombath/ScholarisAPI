// Load env first so every module sees process.env values
require('dotenv').config();

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
const AcademicYearController = require('./src/modules/academic_years/academic_years.route');
const SemesterController = require('./src/modules/semesters/semesters.route');
const TimeSlotController = require('./src/modules/time_slots/time_slots.route');
const ScheduleController = require('./src/modules/schedules/schedules.route');
const GradingCriteriaController = require('./src/modules/grading_criteria/grading_criteria.route');
const AssessmentController = require('./src/modules/assessments/assessments.route');
const GradeController = require('./src/modules/grades/grades.route');
const FinalGradeController = require('./src/modules/final_grades/final_grades.route');
const FeeStructureController = require('./src/modules/fee_structures/fee_structures.route');
const InvoiceController = require('./src/modules/invoices/invoices.route');
const PaymentController = require('./src/modules/payments/payments.route');
const LessonResourceController = require('./src/modules/lesson_resources/lesson_resources.route');
const DashboardController = require('./src/modules/dashboard/dashboard.route');
const ReportsController = require('./src/modules/reports/reports.route');
const StudentPortalController = require('./src/modules/student_portal/student_portal.route');
const errorHandler = require('./src/middleware/errorHandler');

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
    BakongQRRequests,
    Certificates,
    LessonResources
} = require('./src/models/mappingContext');

const { StripeWebhook, BakongWebhook } = require('./src/modules/payments/payments.controller');

const app = express();
app.use(cors());

// Stripe webhook must receive the raw body before express.json()
app.post('/payment/stripe/webhook', express.raw({ type: 'application/json' }), StripeWebhook);

app.use(express.json());

// Bakong webhook is parsed as JSON
app.post('/payment/bakong/webhook', BakongWebhook);

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
AcademicYearController(app);
SemesterController(app);
TimeSlotController(app);
ScheduleController(app);
GradingCriteriaController(app);
AssessmentController(app);
GradeController(app);
FinalGradeController(app);
FeeStructureController(app);
InvoiceController(app);
PaymentController(app);
LessonResourceController(app);
DashboardController(app);
ReportsController(app);
StudentPortalController(app);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`));

const gracefulShutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
        try {
            await sequelize.close();
            console.log('Database connection closed.');
        } catch (err) {
            console.error('Error closing database connection:', err.message);
        }
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));