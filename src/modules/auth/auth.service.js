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
        first_name,
        last_name,
        gender,
        dob,
        contact_number,
        address,
        photo_url
    } = userData;

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

    const password = 'Student123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
        username,
        email,
        role: 'Student',
        password_hash: hashedPassword
    });

    const newStudent = await Students.create({
        user_id: newUser.user_id,
        first_name,
        last_name,
        gender,
        dob,
        contact_number,
        address,
        photo_url,
        enrollment_date: todayString()
    });

    const token = jwt.sign(
        {
            user_id: newUser.user_id,
            email: newUser.email,
            role: newUser.role,
            teacher_id: null,
            student_id: newStudent.student_id
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
            teacher_id: null,
            student_id: newStudent.student_id
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
