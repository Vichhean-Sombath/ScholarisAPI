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

// Update
const ValidationUpdateUser = (data) => {
    const error = [];
    const { 
        userFirstName,
        userLastName,
        userEmail,
        userPassword,
        userAddress,
        userDOB,
        userGender,
        isActive,
    } = data;

    if (userFirstName !== undefined && (typeof userFirstName !== 'string' || userFirstName.trim() === '')) {
        error.push('First name must be a non-empty string.');
    }

    if (userLastName !== undefined && (typeof userLastName !== 'string' || userLastName.trim() === '')) {
        error.push('Last name must be a non-empty string.');
    }

    if (userEmail !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        error.push('Invalid email format.');
    }

    if (userPassword !== undefined && (typeof userPassword !== 'string' || userPassword.length < 8)) {
        error.push('Password must be at least 8 characters.');
    }

    if (userAddress !== undefined && (typeof userAddress !== 'string' || userAddress.trim() === '')) {
        error.push('Address must be a non-empty string.');
    }

    if (userDOB !== undefined && isNaN(Date.parse(userDOB))) {
        error.push('Invalid date of birth.');
    }

    if (userGender !== undefined && !['Male', 'Female', 'Other'].includes(userGender)) {
        error.push('Gender must be Male, Female, or Other.');
    }
    
    if (isActive !== undefined && !['active', 'inactive'].includes(isActive)) {
        error.push('isActive must be active or inactive.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateUser,
    ValidationUpdateUser
}