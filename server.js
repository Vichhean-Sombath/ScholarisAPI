// Dependencies
const express = require('express');
const cors = require('cors');
const UserController = require('./src/modules/users/users.route');
const AuthController = require('./src/modules/auth/auth.route');
const StudentController = require('./src/modules/students/students.route');
const TeacherController = require('./src/modules/teachers/teachers.route');
const ClassController = require('./src/modules/classes/classes.route');
const SubjectController = require('./src/modules/subjects/subjects.route');
const ClassSubjectController = require('./src/modules/classes_subjects/classes_subjects.route');

// Sync DB
const sequelize = require('./src/config/db');
sequelize.sync({ alter: true })
    .then(() => console.log('Database updated!'))
    .catch((err) => console.log('Database sync error: ', err));

// Models
const {
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
ClassSubjectController(app);

app.listen(3000, () => console.log('Server is listening on port 3000!'));