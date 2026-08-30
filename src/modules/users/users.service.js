const bcrypt = require('bcrypt');
const Users = require('../../models/users.model');
const Teachers = require('../../models/teachers.model');
const Students = require('../../models/students.model');
require('../../models/mappingContext');
const { checkDuplicateEmail, checkDuplicatePhone, todayString } = require('../../utils/validationHelpers');

const CreateUserData = async (userData) => {
    const {
        username,
        email,
        role,
        first_name,
        last_name,
        gender,
        dob,
        contact_number,
        specialization,
        bio,
        photo_url,
        address
    } = userData;

    const existingEmail = await checkDuplicateEmail(email);
    if (existingEmail) {
        const err = new Error('This email already exists!');
        err.statusCode = 409;
        throw err;
    }

    const existingUsername = await Users.findOne({ username });
    if (existingUsername) {
        const err = new Error('This username already exists!');
        err.statusCode = 409;
        throw err;
    }

    const allowedRoles = ['Admin', 'Teacher', 'Student'];
    if (!allowedRoles.includes(role)) {
        const err = new Error('Role must be Admin, Teacher or Student!');
        err.statusCode = 400;
        throw err;
    }

    if (!userData.password) {
        const err = new Error('Password is required.');
        err.statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const lastUser = await Users.findOne().sort({ user_id: -1 });
    const user_id = lastUser ? lastUser.user_id + 1 : 1;

    const newUser = await Users.create({
        user_id,
        username,
        email,
        role,
        password_hash: hashedPassword
    });

    if (role === 'Teacher') {
        const existingPhone = await checkDuplicatePhone(contact_number, newUser.user_id);
        if (existingPhone) {
            const err = new Error('This phone number already exists!');
            err.statusCode = 409;
            throw err;
        }

        const lastTeacher = await Teachers.findOne().sort({ teacher_id: -1 });
        const teacher_id = lastTeacher ? lastTeacher.teacher_id + 1 : 1;

        await Teachers.create({
            teacher_id,
            user_id: newUser.user_id,
            first_name,
            last_name,
            gender,
            dob,
            contact_number,
            specialization,
            bio,
            hire_date: todayString()
        });
    }

    if (role === 'Student') {
        const existingPhone = await checkDuplicatePhone(contact_number, newUser.user_id);
        if (existingPhone) {
            const err = new Error('This phone number already exists!');
            err.statusCode = 409;
            throw err;
        }

        const lastStudent = await Students.findOne().sort({ student_id: -1 });
        const student_id = lastStudent ? lastStudent.student_id + 1 : 1;

        await Students.create({
            student_id,
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
    }

    return {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
    };
};

const UpdateUserData = async (user_id, userData, currentUser) => {
    const user = await Users.findOne({ user_id });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role !== 'Admin' && currentUser.user_id !== parseInt(user_id)) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.role !== 'Admin') {
        if (userData.role !== undefined || userData.status !== undefined) {
            const err = new Error('Forbidden. You cannot change role or status!');
            err.statusCode = 403;
            throw err;
        }
    }

    if (userData.email && userData.email !== user.email) {
        const existingEmail = await checkDuplicateEmail(userData.email, user.user_id);
        if (existingEmail) {
            const err = new Error('This email already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (userData.username && userData.username !== user.username) {
        const existingUsername = await Users.findOne({ username: userData.username });
        if (existingUsername) {
            const err = new Error('This username already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (userData.contact_number) {
        const existingPhone = await checkDuplicatePhone(userData.contact_number, user.user_id);
        if (existingPhone) {
            const err = new Error('This phone number already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (userData.password) {
        userData.password_hash = await bcrypt.hash(userData.password, 10);
        delete userData.password;
    }

    delete userData.password_hash;

    Object.assign(user, userData);
    await user.save();

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        last_login_at: user.last_login_at
    };
};

const ChangePasswordData = async (currentUser, { currentPassword, newPassword }) => {
    if (!currentPassword || !newPassword) {
        const err = new Error('Current password and new password are required!');
        err.statusCode = 400;
        throw err;
    }

    const user = await Users.findOne({ user_id: currentUser.user_id });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
        const err = new Error('Current password is incorrect!');
        err.statusCode = 401;
        throw err;
    }

    if (newPassword.length < 8) {
        const err = new Error('New password must be at least 8 characters!');
        err.statusCode = 400;
        throw err;
    }
    if (!/[A-Z]/.test(newPassword)) {
        const err = new Error('New password must contain at least one uppercase letter!');
        err.statusCode = 400;
        throw err;
    }
    if (!/[a-z]/.test(newPassword)) {
        const err = new Error('New password must contain at least one lowercase letter!');
        err.statusCode = 400;
        throw err;
    }
    if (!/\d/.test(newPassword)) {
        const err = new Error('New password must contain at least one number!');
        err.statusCode = 400;
        throw err;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
        const err = new Error('New password must contain at least one special character!');
        err.statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();

    return {
        user_id: user.user_id,
        email: user.email,
        role: user.role
    };
};

const DisableUserData = async (user_id, currentUser) => {
    const user = await Users.findOne({ user_id });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role !== 'Admin') {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (user.role === 'Admin') {
        const err = new Error('Cannot disable admin account!');
        err.statusCode = 403;
        throw err;
    }

    if (currentUser.user_id === parseInt(user_id)) {
        const err = new Error('You cannot deactivate your own account!');
        err.statusCode = 403;
        throw err;
    }

    if (user.status === 'Inactive') {
        const err = new Error('User is already deactivated!');
        err.statusCode = 400;
        throw err;
    }

    user.status = 'Inactive';
    await user.save();

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

const EnableUserData = async (user_id, currentUser) => {
    const user = await Users.findOne({ user_id });
    if (!user) {
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role !== 'Admin') {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (user.status === 'Active') {
        const err = new Error('User is already active!');
        err.statusCode = 400;
        throw err;
    }

    user.status = 'Active';
    await user.save();

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

module.exports = {
    CreateUserData,
    UpdateUserData,
    ChangePasswordData,
    DisableUserData,
    EnableUserData
};
