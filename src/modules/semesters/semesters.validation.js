const ValidationCreateSemester = (data) => {
    const error = [];
    const { academic_year_id, semester_name, start_date, end_date } = data;

    if (academic_year_id === undefined || academic_year_id === null || isNaN(Number(academic_year_id))) {
        error.push('Academic year ID required and must be a number!');
    }

    if (!semester_name || semester_name.trim() === '') {
        error.push('Semester name required!');
    }

    if (!start_date || start_date.trim() === '') {
        error.push('Start date required!');
    }

    if (!end_date || end_date.trim() === '') {
        error.push('End date required!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateSemester = (data) => {
    const error = [];
    const { academic_year_id, semester_name, start_date, end_date } = data;

    if (academic_year_id !== undefined && isNaN(Number(academic_year_id))) {
        error.push('Academic year ID must be a number.');
    }

    if (semester_name !== undefined && (typeof semester_name !== 'string' || semester_name.trim() === '')) {
        error.push('Semester name must be a non-empty string.');
    }

    if (start_date !== undefined && (typeof start_date !== 'string' || start_date.trim() === '')) {
        error.push('Start date must be a non-empty string.');
    }

    if (end_date !== undefined && (typeof end_date !== 'string' || end_date.trim() === '')) {
        error.push('End date must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateSemester,
    ValidationUpdateSemester
};
