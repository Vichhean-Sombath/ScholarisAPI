const ValidationCreateAssessment = (data) => {
    const error = [];
    const { criteria_id, class_id, subject_id, teacher_id, assessment_name, max_score, assessment_date } = data;

    if (criteria_id === undefined || criteria_id === null || isNaN(Number(criteria_id))) {
        error.push('Criteria ID required and must be a number!');
    }

    if (class_id === undefined || class_id === null || isNaN(Number(class_id))) {
        error.push('Class ID required and must be a number!');
    }

    if (subject_id === undefined || subject_id === null || isNaN(Number(subject_id))) {
        error.push('Subject ID required and must be a number!');
    }

    if (teacher_id === undefined || teacher_id === null || isNaN(Number(teacher_id))) {
        error.push('Teacher ID required and must be a number!');
    }

    if (!assessment_name || assessment_name.trim() === '') {
        error.push('Assessment name required!');
    }

    if (max_score === undefined || isNaN(Number(max_score)) || Number(max_score) <= 0) {
        error.push('Max score required and must be greater than 0!');
    }

    if (assessment_date !== undefined && (typeof assessment_date !== 'string' || assessment_date.trim() === '')) {
        error.push('Assessment date must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateAssessment = (data) => {
    const error = [];
    const { criteria_id, class_id, subject_id, teacher_id, assessment_name, max_score, assessment_date } = data;

    if (criteria_id !== undefined && isNaN(Number(criteria_id))) {
        error.push('Criteria ID must be a number.');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (subject_id !== undefined && isNaN(Number(subject_id))) {
        error.push('Subject ID must be a number.');
    }

    if (teacher_id !== undefined && isNaN(Number(teacher_id))) {
        error.push('Teacher ID must be a number.');
    }

    if (assessment_name !== undefined && (typeof assessment_name !== 'string' || assessment_name.trim() === '')) {
        error.push('Assessment name must be a non-empty string.');
    }

    if (max_score !== undefined && (isNaN(Number(max_score)) || Number(max_score) <= 0)) {
        error.push('Max score must be greater than 0.');
    }

    if (assessment_date !== undefined && (typeof assessment_date !== 'string' || assessment_date.trim() === '')) {
        error.push('Assessment date must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateAssessment,
    ValidationUpdateAssessment
};
