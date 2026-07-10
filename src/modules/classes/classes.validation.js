const ValidationCreateClass = (data) => {
    const error = [];
    const { class_name, academic_year_id, semester_id } = data;

    if (!class_name || class_name.trim() === '') {
        error.push('Class name required!');
    }

    if (!academic_year_id || isNaN(Number(academic_year_id))) {
        error.push('Academic year ID required and must be a number!');
    }

    if (!semester_id || isNaN(Number(semester_id))) {
        error.push('Semester ID required and must be a number!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateClass = (data) => {
    const error = [];
    const { class_name, academic_year_id, semester_id, max_capacity, homeroom_teacher_id } = data;

    if (class_name !== undefined && (typeof class_name !== 'string' || class_name.trim() === '')) {
        error.push('Class name must be a non-empty string.');
    }

    if (academic_year_id !== undefined && isNaN(Number(academic_year_id))) {
        error.push('Academic year ID must be a number.');
    }

    if (semester_id !== undefined && isNaN(Number(semester_id))) {
        error.push('Semester ID must be a number.');
    }

    if (max_capacity !== undefined && (isNaN(Number(max_capacity)) || Number(max_capacity) < 1)) {
        error.push('Max capacity must be a positive number.');
    }

    if (homeroom_teacher_id !== undefined && isNaN(Number(homeroom_teacher_id))) {
        error.push('Homeroom teacher ID must be a number.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateClass,
    ValidationUpdateClass
};
