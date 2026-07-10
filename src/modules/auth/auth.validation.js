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

module.exports = {
    ValidationLoginUser
};
