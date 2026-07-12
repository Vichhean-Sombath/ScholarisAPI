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

const ValidationRegisterUser = (data) => {
    const error = [];
    const {
        username,
        email,
        password,
        first_name,
        last_name,
        gender,
        dob,
        enrollment_date
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

    if (!first_name || isEmpty(first_name)) {
        error.push('First name required!');
    }

    if (!last_name || isEmpty(last_name)) {
        error.push('Last name required!');
    }

    if (!enrollment_date || isEmpty(enrollment_date)) {
        error.push('Enrollment date required!');
    } else if (isNaN(Date.parse(enrollment_date))) {
        error.push('Invalid enrollment date!');
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

module.exports = {
    ValidationLoginUser,
    ValidationRegisterUser
};
