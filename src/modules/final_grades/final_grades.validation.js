const ValidationCreateFinalGrade = (data) => {
    const error = [];
    const { student_id, subject_id, class_id, semester_id, final_score, letter_grade, gpa_points } = data;

    if (student_id === undefined || student_id === null || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number!');
    }

    if (subject_id === undefined || subject_id === null || isNaN(Number(subject_id))) {
        error.push('Subject ID required and must be a number!');
    }

    if (class_id === undefined || class_id === null || isNaN(Number(class_id))) {
        error.push('Class ID required and must be a number!');
    }

    if (semester_id === undefined || semester_id === null || isNaN(Number(semester_id))) {
        error.push('Semester ID required and must be a number!');
    }

    if (final_score === undefined || isNaN(Number(final_score)) || Number(final_score) < 0 || Number(final_score) > 100) {
        error.push('Final score required and must be between 0 and 100!');
    }

    if (letter_grade !== undefined && (typeof letter_grade !== 'string' || letter_grade.trim() === '')) {
        error.push('Letter grade must be a non-empty string.');
    }

    if (gpa_points !== undefined && (isNaN(Number(gpa_points)) || Number(gpa_points) < 0 || Number(gpa_points) > 4)) {
        error.push('GPA points must be between 0 and 4.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateFinalGrade = (data) => {
    const error = [];
    const { student_id, subject_id, class_id, semester_id, final_score, letter_grade, gpa_points } = data;

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (subject_id !== undefined && isNaN(Number(subject_id))) {
        error.push('Subject ID must be a number.');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (semester_id !== undefined && isNaN(Number(semester_id))) {
        error.push('Semester ID must be a number.');
    }

    if (final_score !== undefined && (isNaN(Number(final_score)) || Number(final_score) < 0 || Number(final_score) > 100)) {
        error.push('Final score must be between 0 and 100.');
    }

    if (letter_grade !== undefined && (typeof letter_grade !== 'string' || letter_grade.trim() === '')) {
        error.push('Letter grade must be a non-empty string.');
    }

    if (gpa_points !== undefined && (isNaN(Number(gpa_points)) || Number(gpa_points) < 0 || Number(gpa_points) > 4)) {
        error.push('GPA points must be between 0 and 4.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateFinalGrade,
    ValidationUpdateFinalGrade
};
