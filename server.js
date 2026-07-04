// Dependencies
const express = require('express');
const cors = require('cors');
const UserController = require('./src/modules/users/users.route');
const AuthController = require('./src/modules/auth/auth.route');
const StudentController = require('./src/modules/students/students.route');

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


app.listen(3000, () => console.log('Server is listening on port 3000!'));