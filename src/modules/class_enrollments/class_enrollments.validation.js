const ValidationCreateClassEnrollment = (data) => {
    const error = [];
    const { student_id, class_id, enrollment_date } = data;

    if (student_id === undefined || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number!');
    }

    if (class_id === undefined || isNaN(Number(class_id))) {
        error.push('Class ID required and must be a number!');
    }

    if (!enrollment_date || isNaN(Date.parse(enrollment_date))) {
        error.push('Enrollment date required and must be a valid date!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateClassEnrollment = (data) => {
    const error = [];
    const { student_id, class_id, enrollment_date, status } = data;

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (enrollment_date !== undefined && isNaN(Date.parse(enrollment_date))) {
        error.push('Enrollment date must be a valid date.');
    }

    if (status !== undefined && !['Active', 'Transferred', 'Withdrawn'].includes(status)) {
        error.push('Status must be Active, Transferred, or Withdrawn.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateClassEnrollment,
    ValidationUpdateClassEnrollment
};
