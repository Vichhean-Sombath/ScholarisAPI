const ValidationCreateGradingCriteria = (data) => {
    const error = [];
    const { subject_id, class_id, component_name, weight_percentage, attempt_count } = data;

    const hasSubject = subject_id !== undefined && subject_id !== null && !isNaN(Number(subject_id));
    const hasClass = class_id !== undefined && class_id !== null && !isNaN(Number(class_id));

    if (!hasSubject && !hasClass) {
        error.push('Please select at least a subject or a class.');
    }

    if (!component_name || component_name.trim() === '') {
        error.push('Component name required!');
    }

    if (weight_percentage === undefined || isNaN(Number(weight_percentage)) || Number(weight_percentage) <= 0 || Number(weight_percentage) > 100) {
        error.push('Weight percentage required and must be between 0 and 100!');
    }

    if (attempt_count === undefined || isNaN(Number(attempt_count)) || Number(attempt_count) <= 0 || !Number.isInteger(Number(attempt_count))) {
        error.push('Attempt count required and must be a positive whole number!');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateGradingCriteria = (data) => {
    const error = [];
    const { subject_id, class_id, component_name, weight_percentage, attempt_count } = data;

    if (subject_id !== undefined && isNaN(Number(subject_id))) {
        error.push('Subject ID must be a number.');
    }

    if (component_name !== undefined && (typeof component_name !== 'string' || component_name.trim() === '')) {
        error.push('Component name must be a non-empty string.');
    }

    if (weight_percentage !== undefined && (isNaN(Number(weight_percentage)) || Number(weight_percentage) <= 0 || Number(weight_percentage) > 100)) {
        error.push('Weight percentage must be between 0 and 100.');
    }

    if (attempt_count !== undefined && (isNaN(Number(attempt_count)) || Number(attempt_count) <= 0 || !Number.isInteger(Number(attempt_count)))) {
        error.push('Attempt count must be a positive whole number.');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateGradingCriteria,
    ValidationUpdateGradingCriteria
};
