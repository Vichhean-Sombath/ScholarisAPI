// Create
const ValidationCreateUser = (data) => {
    const error = [];
    const { 
        userFirstName,
        userLastName,
        userRole,
        userEmail,
        userPassword,
        userAddress,
        userDOB,
        userGender
    } = data;

    // Required field
    const isEmpty = (value) => !value || value.toString().trim() === '';

    if(!userFirstName || isEmpty(userFirstName)) error.push('First name required!');
    if(!userLastName || isEmpty(userLastName)) error.push('Last name required!');

    // Email format
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!userEmail || isEmpty(userEmail)){
        error.push('Email required!')
    } else if(!emailFormat.test(userEmail)){
        error.push('Invalid email format!')
    };
    
    // Password
    if (!userPassword || isEmpty(userPassword)) {
        error.push('Password required!');
    } else if (userPassword.length < 8) {
        error.push('Password must be at least 8 characters!');
    } else if (!/[A-Z]/.test(userPassword)) {
        error.push('Password must contain at least one capital letter!');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userPassword)) {
        error.push('Password must contain at least one special character!');
    };

    // Gender
    const allowedGender = ['Male', 'Female', 'Other'];
    if (!allowedGender.includes(userGender)) {
        error.push('Gender must be Male, Female, or Other!');
    }

    // Address
    if(!userAddress || isEmpty(userAddress)) error.push('Address required!');

    // Date of Birth
    if (!userDOB || isEmpty(userDOB)) {
        error.push('Date of Birth required!');
    } else if (isNaN(new Date(userDOB).getTime())) {
        error.push('Invalid date of birth format!');
    }

    // Role
    const userAllowedRole = ['admin', 'student', 'teacher'];
    if(!userRole || isEmpty(userRole)){
        error.push('Role required!')
    } else if(!userAllowedRole.includes(userRole)){
        error.push('Role must be only Admin, Teacher, and Student!');
    }


    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null};
};



module.exports = {
    ValidationCreateUser,
}