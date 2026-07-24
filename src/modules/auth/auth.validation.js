const ValidationLoginUser = (data) => {
    const error = [];
    const { email, password } = data;

    const isEmpty = (value) => !value || value.toString().trim() === '';
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || isEmpty(email)) {
        error.push('Email required!');
    } else if (!emailFormat.test(email)) {
        error.push('Invalid email format!');
    }

    if (!password || isEmpty(password)) {
        error.push('Password required!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const { validateEmail, validateUsername, validatePassword, validateDob, validatePhone } = require('../../utils/validationHelpers');

const ValidationRegisterUser = (data) => {
    const error = [];
    const {
        username,
        email,
        password,
        role,
        first_name,
        last_name,
        gender,
        dob,
        contact_number
    } = data;

    validateUsername(username, error);
    validateEmail(email, error);
    validatePassword(password, error, 'Password');

    if (!role || (typeof role === 'string' && role.trim() === '')) {
        error.push('Role required!');
    } else if (!['Teacher', 'Student'].includes(role)) {
        error.push('Role must be Teacher or Student!');
    }

    if (!first_name || (typeof first_name === 'string' && first_name.trim() === '')) {
        error.push(`${role || 'User'} first name required!`);
    }

    if (!last_name || (typeof last_name === 'string' && last_name.trim() === '')) {
        error.push(`${role || 'User'} last name required!`);
    }

    if (role === 'Teacher') {
        validateDob(dob, 25, error, 'Teacher');
    } else if (role === 'Student') {
        validateDob(dob, 16, error, 'Student');
    }

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other!');
    }

    validatePhone(contact_number, error, role === 'Teacher' ? 'Teacher phone number' : 'Phone number');

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationLoginUser,
    ValidationRegisterUser
};
