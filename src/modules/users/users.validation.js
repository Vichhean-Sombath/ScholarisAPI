const ValidationCreateUser = (data) => {
    const error = [];
    const {
        username,
        email,
        role,
        password,
        first_name,
        last_name,
        gender,
        dob
    } = data;

    const isEmpty = (value) => !value || value.toString().trim() === '';
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || isEmpty(username)) {
        error.push('Username required!');
    } else if (username.length > 50) {
        error.push('Username must not exceed 50 characters!');
    }

    if (!email || isEmpty(email)) {
        error.push('Email required!');
    } else if (!emailFormat.test(email)) {
        error.push('Invalid email format!');
    } else if (email.length > 100) {
        error.push('Email must not exceed 100 characters!');
    }

    if (!password || isEmpty(password)) {
        error.push('Password required!');
    } else if (password.length < 8) {
        error.push('Password must be at least 8 characters!');
    } else if (!/[A-Z]/.test(password)) {
        error.push('Password must contain at least one capital letter!');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        error.push('Password must contain at least one special character!');
    }

    if (!role || isEmpty(role)) {
        error.push('Role required!');
    } else if (!['Admin', 'Teacher'].includes(role)) {
        error.push('Role must be Admin or Teacher!');
    }

    if (role === 'Teacher') {
        if (!first_name || isEmpty(first_name)) {
            error.push('Teacher first name required!');
        }
        if (!last_name || isEmpty(last_name)) {
            error.push('Teacher last name required!');
        }
    }

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other!');
    }

    if (dob !== undefined && isNaN(Date.parse(dob))) {
        error.push('Invalid date of birth format!');
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
        password,
        status,
        gender,
        dob
    } = data;

    if (username !== undefined && (typeof username !== 'string' || username.trim() === '')) {
        error.push('Username must be a non-empty string.');
    }

    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        error.push('Invalid email format.');
    }

    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
        error.push('Password must be at least 8 characters.');
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

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateUser,
    ValidationUpdateUser
};
