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
        first_name,
        last_name,
        gender,
        dob,
        contact_number
    } = data;

    validateUsername(username, error);
    validateEmail(email, error);

    if (!first_name || (typeof first_name === 'string' && first_name.trim() === '')) {
        error.push('First name required!');
    }

    if (!last_name || (typeof last_name === 'string' && last_name.trim() === '')) {
        error.push('Last name required!');
    }

    validateDob(dob, 16, error, 'Student');

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other!');
    }

    validatePhone(contact_number, error, 'Phone number');

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationLoginUser,
    ValidationRegisterUser
};
