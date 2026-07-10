const ValidationCreateGrade = (data) => {
    const error = [];
    const { assessment_id, student_id, score, entered_by, is_published } = data;

    if (assessment_id === undefined || assessment_id === null || isNaN(Number(assessment_id))) {
        error.push('Assessment ID required and must be a number!');
    }

    if (student_id === undefined || student_id === null || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number!');
    }

    if (score === undefined || isNaN(Number(score)) || Number(score) < 0) {
        error.push('Score required and must be 0 or greater!');
    }

    if (entered_by === undefined || entered_by === null || isNaN(Number(entered_by))) {
        error.push('Entered by (teacher ID) required and must be a number!');
    }

    if (is_published !== undefined && typeof is_published !== 'boolean') {
        error.push('Is published must be a boolean.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateGrade = (data) => {
    const error = [];
    const { assessment_id, student_id, score, entered_by, is_published } = data;

    if (assessment_id !== undefined && isNaN(Number(assessment_id))) {
        error.push('Assessment ID must be a number.');
    }

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (score !== undefined && (isNaN(Number(score)) || Number(score) < 0)) {
        error.push('Score must be 0 or greater.');
    }

    if (entered_by !== undefined && isNaN(Number(entered_by))) {
        error.push('Entered by must be a number.');
    }

    if (is_published !== undefined && typeof is_published !== 'boolean') {
        error.push('Is published must be a boolean.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateGrade,
    ValidationUpdateGrade
};
