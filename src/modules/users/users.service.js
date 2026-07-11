const bcrypt = require('bcrypt');
const Users = require('../../models/users.model');
const Teachers = require('../../models/teachers.model');
const Students = require('../../models/students.model');
require('../../models/mappingContext');

const CreateUserData = async (userData) => {
    const {
        username,
        email,
        role,
        password,
        first_name,
        last_name,
        gender,
        dob,
        contact_number,
        specialization,
        bio,
        hire_date,
        enrollment_date,
        photo_url,
        address
    } = userData;

    const existingEmail = await Users.findOne({ where: { email } });
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

    const allowedRoles = ['Admin', 'Teacher', 'Student'];
    if (!allowedRoles.includes(role)) {
        const err = new Error('Role must be Admin, Teacher or Student!');
        err.statusCode = 400;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
        username,
        email,
        role,
        password_hash: hashedPassword
    });

    if (role === 'Teacher') {
        if (!first_name || !last_name) {
            const err = new Error('Teacher first and last name are required!');
            err.statusCode = 400;
            throw err;
        }

        await Teachers.create({
            user_id: newUser.user_id,
            first_name,
            last_name,
            gender,
            dob,
            contact_number,
            specialization,
            bio,
            hire_date
        });
    }

    if (role === 'Student') {
        if (!first_name || !last_name || !enrollment_date) {
            const err = new Error('Student first name, last name and enrollment date are required!');
            err.statusCode = 400;
            throw err;
        }

        if (isNaN(Date.parse(enrollment_date))) {
            const err = new Error('Invalid enrollment date!');
            err.statusCode = 400;
            throw err;
        }

        if (dob !== undefined && isNaN(Date.parse(dob))) {
            const err = new Error('Invalid date of birth!');
            err.statusCode = 400;
            throw err;
        }

        await Students.create({
            user_id: newUser.user_id,
            first_name,
            last_name,
            gender,
            dob,
            contact_number,
            address,
            photo_url,
            enrollment_date
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
    const user = await Users.findByPk(user_id);
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
        const existingEmail = await Users.findOne({ where: { email: userData.email } });
        if (existingEmail) {
            const err = new Error('This email already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (userData.username && userData.username !== user.username) {
        const existingUsername = await Users.findOne({ where: { username: userData.username } });
        if (existingUsername) {
            const err = new Error('This username already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (userData.password) {
        userData.password_hash = await bcrypt.hash(userData.password, 10);
        delete userData.password;
    }

    delete userData.password_hash;

    await user.update(userData);

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        last_login_at: user.last_login_at
    };
};

const DisableUserData = async (user_id, currentUser) => {
    const user = await Users.findByPk(user_id);
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

    await user.update({ status: 'Inactive' });

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
    };
};

const EnableUserData = async (user_id, currentUser) => {
    const user = await Users.findByPk(user_id);
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

    await user.update({ status: 'Active' });

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
    DisableUserData,
    EnableUserData
};
