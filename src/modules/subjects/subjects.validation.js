const ValidationCreateSubject = (data) => {
    const error = [];
    const { subject_code, subject_name } = data;

    if (!subject_name || subject_name.trim() === '') {
        error.push('Subject name required!');
    }

    if (!subject_code || subject_code.trim() === '') {
        error.push('Subject code required!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateSubject = (data) => {
    const error = [];
    const { subject_code, subject_name, prerequisite_subject_id } = data;

    if (subject_code !== undefined && (typeof subject_code !== 'string' || subject_code.trim() === '')) {
        error.push('Subject code must be a non-empty string.');
    }

    if (subject_name !== undefined && (typeof subject_name !== 'string' || subject_name.trim() === '')) {
        error.push('Subject name must be a non-empty string.');
    }

    if (prerequisite_subject_id !== undefined && isNaN(Number(prerequisite_subject_id))) {
        error.push('Prerequisite subject ID must be a number.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateSubject,
    ValidationUpdateSubject
};
