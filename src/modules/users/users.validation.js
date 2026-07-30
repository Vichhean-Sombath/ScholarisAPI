const { validateEmail, validateUsername, validateDob, validatePhone } = require('../../utils/validationHelpers');

const ValidationCreateUser = (data) => {
    const error = [];
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
        hire_date
    } = data;

    validateUsername(username, error);
    validateEmail(email, error);

    if (!role || (typeof role === 'string' && role.trim() === '')) {
        error.push('Role required!');
    } else if (!['Admin', 'Teacher', 'Student'].includes(role)) {
        error.push('Role must be Admin, Teacher, or Student!');
    }

    if (role === 'Teacher' || role === 'Student') {
        if (!first_name || (typeof first_name === 'string' && first_name.trim() === '')) {
            error.push(`${role} first name required!`);
        }
        if (!last_name || (typeof last_name === 'string' && last_name.trim() === '')) {
            error.push(`${role} last name required!`);
        }
    }

    if (role === 'Teacher') {
        validateDob(dob, 25, error, 'Teacher');
        if (!specialization || (typeof specialization === 'string' && specialization.trim() === '')) {
            error.push('Teacher specialization required!');
        }
        if (!hire_date || isNaN(Date.parse(hire_date))) {
            error.push('Invalid hire date!');
        }
    }

    if (role === 'Student') {
        validateDob(dob, 16, error, 'Student');
    }

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other!');
    }

    if (role !== 'Admin') {
        validatePhone(contact_number, error, role === 'Teacher' ? 'Teacher phone number' : 'Phone number');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateUser = (data) => {
    const error = [];
    const {
        username,
        email,
        status,
        gender,
        dob,
        contact_number,
        role
    } = data;

    if (username !== undefined && (typeof username !== 'string' || username.trim() === '')) {
        error.push('Username must be a non-empty string.');
    }

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.push('Invalid email format.');
    }

    if (status !== undefined && !['Active', 'Inactive'].includes(status)) {
        error.push('Status must be Active or Inactive.');
    }

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other.');
    }

    if (dob !== undefined && isNaN(Date.parse(dob))) {
        error.push('Invalid date of birth.');
    }

    if (contact_number !== undefined) {
        const digits = String(contact_number).replace(/\D/g, '');
        if (!/^\d{9,10}$/.test(digits)) {
            error.push('Phone number must be 9-10 digits.');
        }
    }

    if (role !== undefined && !['Admin', 'Teacher', 'Student'].includes(role)) {
        error.push('Role must be Admin, Teacher, or Student.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateUser,
    ValidationUpdateUser
};
