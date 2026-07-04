// Login
const ValidationLoginUser = (data) => {
    const error = [];
    const { userEmail, userPassword } = data;

    const isEmpty = (value) => !value || value.toString().trim() === '';

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userEmail || isEmpty(userEmail)) {
        error.push('Email required!');
    } else if (!emailFormat.test(userEmail)) {
        error.push('Invalid email format!');
    }

    if (!userPassword || isEmpty(userPassword)) {
        error.push('Password required!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationLoginUser,
};
