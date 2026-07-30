const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../models/users.model');
const Teachers = require('../../models/teachers.model');
const Students = require('../../models/students.model');

const LoginUserData = async (userData) => {
    const { email, password } = userData;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
        const err = new Error('Invalid email!');
        err.statusCode = 401;
        throw err;
    }

    const isMatchPassword = await bcrypt.compare(password, user.password_hash);
    if (!isMatchPassword) {
        const err = new Error('Invalid password!');
        err.statusCode = 401;
        throw err;
    }

    await user.update({ last_login_at: new Date() });

    const teacher = await Teachers.findOne({ where: { user_id: user.user_id } });
    const student = await Students.findOne({ where: { user_id: user.user_id } });

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            teacher_id: teacher ? teacher.teacher_id : null,
            student_id: student ? student.student_id : null
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' }
    );

    return {
        message: 'Login successful!',
        token,
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
            teacher_id: teacher ? teacher.teacher_id : null,
            student_id: student ? student.student_id : null
        }
    };
};

const { checkDuplicateEmail, checkDuplicatePhone, todayString } = require('../../utils/validationHelpers');

const RegisterUserData = async (userData) => {
    const {
        username,
        email,
        password,
        role,
        first_name,
        last_name,
        gender,
        dob,
        contact_number,
        address,
        photo_url,
        specialization,
        bio,
        enrollment_date
    } = userData;

    const allowedRoles = ['Teacher', 'Student'];
    if (!allowedRoles.includes(role)) {
        const err = new Error('Role must be Teacher or Student!');
        err.statusCode = 400;
        throw err;
    }

    const existingEmail = await checkDuplicateEmail(email);
    if (existingEmail) {
        const err = new Error('This email already exists!');
        err.statusCode = 409;
        throw err;
    }

    const existingUsername = await Users.findOne({ where: { username } });
    if (existingUsername) {
        const err = new Error('This username already exists!');
        err.statusCode = 409;
        throw err;
    }

    const existingPhone = await checkDuplicatePhone(contact_number);
    if (existingPhone) {
        const err = new Error('This phone number already exists!');
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
        username,
        email,
        role,
        password_hash: hashedPassword
    });

    let teacherId = null;
    let studentId = null;

    if (role === 'Teacher') {
        const newTeacher = await Teachers.create({
            user_id: newUser.user_id,
            first_name,
            last_name,
            gender,
            dob,
            contact_number,
            photo_url,
            specialization,
            bio,
            hire_date: todayString()
        });
        teacherId = newTeacher.teacher_id;
    }

    if (role === 'Student') {
        const newStudent = await Students.create({
            user_id: newUser.user_id,
            first_name,
            last_name,
            gender,
            dob,
            contact_number,
            address,
            photo_url,
            enrollment_date: enrollment_date || todayString()
        });
        studentId = newStudent.student_id;
    }

    const token = jwt.sign(
        {
            user_id: newUser.user_id,
            email: newUser.email,
            role: newUser.role,
            teacher_id: teacherId,
            student_id: studentId
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' }
    );

    return {
        message: 'Registration successful!',
        token,
        user: {
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            teacher_id: teacherId,
            student_id: studentId
        }
    };
};

const LogoutUserData = async () => {
    return {
        message: 'Logout successful!'
    };
};

module.exports = {
    LoginUserData,
    LogoutUserData,
    RegisterUserData
};
