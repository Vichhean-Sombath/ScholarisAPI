const ValidationCreateAssessment = (data) => {
    const error = [];
    const { schedule_id, criteria_id, assessment_name, max_score, assessment_date } = data;

    if (schedule_id === undefined || schedule_id === null || isNaN(Number(schedule_id))) {
        error.push('Schedule ID required and must be a number!');
    }

    if (criteria_id === undefined || criteria_id === null || isNaN(Number(criteria_id))) {
        error.push('Criteria ID required and must be a number!');
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
    const { schedule_id, criteria_id, assessment_name, max_score, assessment_date } = data;

    if (schedule_id !== undefined && isNaN(Number(schedule_id))) {
        error.push('Schedule ID must be a number.');
    }

    if (criteria_id !== undefined && isNaN(Number(criteria_id))) {
        error.push('Criteria ID must be a number.');
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
