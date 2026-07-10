const ValidationCreateGradingCriteria = (data) => {
    const error = [];
    const { subject_id, class_id, component_name, weight_percentage } = data;

    if (subject_id === undefined || subject_id === null || isNaN(Number(subject_id))) {
        error.push('Subject ID required and must be a number!');
    }

    if (!component_name || component_name.trim() === '') {
        error.push('Component name required!');
    }

    if (weight_percentage === undefined || isNaN(Number(weight_percentage)) || Number(weight_percentage) <= 0 || Number(weight_percentage) > 100) {
        error.push('Weight percentage required and must be between 0 and 100!');
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
    const { subject_id, class_id, component_name, weight_percentage } = data;

    if (subject_id !== undefined && isNaN(Number(subject_id))) {
        error.push('Subject ID must be a number.');
    }

    if (component_name !== undefined && (typeof component_name !== 'string' || component_name.trim() === '')) {
        error.push('Component name must be a non-empty string.');
    }

    if (weight_percentage !== undefined && (isNaN(Number(weight_percentage)) || Number(weight_percentage) <= 0 || Number(weight_percentage) > 100)) {
        error.push('Weight percentage must be between 0 and 100.');
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
