const ValidationUpdateStudent = (data) => {
    const error = [];
    const {
        first_name,
        last_name,
        dob,
        gender,
        enrollment_date,
        status
    } = data;

    if (first_name !== undefined && (typeof first_name !== 'string' || first_name.trim() === '')) {
        error.push('First name must be a non-empty string.');
    }

    if (last_name !== undefined && (typeof last_name !== 'string' || last_name.trim() === '')) {
        error.push('Last name must be a non-empty string.');
    }

    if (dob !== undefined && isNaN(Date.parse(dob))) {
        error.push('Invalid date of birth.');
    }

    if (gender !== undefined && !['Male', 'Female', 'Other'].includes(gender)) {
        error.push('Gender must be Male, Female, or Other.');
    }

    if (enrollment_date !== undefined && isNaN(Date.parse(enrollment_date))) {
        error.push('Invalid enrollment date.');
    }

    if (status !== undefined && !['Active', 'Inactive'].includes(status)) {
        error.push('Status must be Active or Inactive.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationUpdateStudent
};
