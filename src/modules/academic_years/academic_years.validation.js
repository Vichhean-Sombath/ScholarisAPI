const ValidationCreateAcademicYear = (data) => {
    const error = [];
    const { year_name, start_date, end_date, status } = data;

    if (!year_name || year_name.trim() === '') {
        error.push('Year name required!');
    }

    if (!start_date || start_date.trim() === '') {
        error.push('Start date required!');
    }

    if (!end_date || end_date.trim() === '') {
        error.push('End date required!');
    }

    if (status !== undefined && !['Active', 'Closed'].includes(status)) {
        error.push('Status must be Active or Closed!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateAcademicYear = (data) => {
    const error = [];
    const { year_name, start_date, end_date, status } = data;

    if (year_name !== undefined && (typeof year_name !== 'string' || year_name.trim() === '')) {
        error.push('Year name must be a non-empty string.');
    }

    if (start_date !== undefined && (typeof start_date !== 'string' || start_date.trim() === '')) {
        error.push('Start date must be a non-empty string.');
    }

    if (end_date !== undefined && (typeof end_date !== 'string' || end_date.trim() === '')) {
        error.push('End date must be a non-empty string.');
    }

    if (status !== undefined && !['Active', 'Closed'].includes(status)) {
        error.push('Status must be Active or Closed!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateAcademicYear,
    ValidationUpdateAcademicYear
};
