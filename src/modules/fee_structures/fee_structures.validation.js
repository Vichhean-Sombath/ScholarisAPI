const isValidDecimal = (value) => {
    if (value === undefined || value === null || value === '') return false;
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};

const ValidationCreateFeeStructure = (data) => {
    const error = [];
    const { class_id, semester_id, fee_name, amount, due_date } = data;

    if (semester_id === undefined || semester_id === null || isNaN(Number(semester_id))) {
        error.push('Semester ID required and must be a number!');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (!fee_name || typeof fee_name !== 'string' || fee_name.trim() === '') {
        error.push('Fee name required and must be a non-empty string.');
    } else if (fee_name.length > 100) {
        error.push('Fee name must not exceed 100 characters.');
    }

    if (!isValidDecimal(amount)) {
        error.push('Amount required and must be a non-negative number.');
    }

    if (due_date !== undefined && isNaN(Date.parse(due_date))) {
        error.push('Invalid due date format.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateFeeStructure = (data) => {
    const error = [];
    const { class_id, semester_id, fee_name, amount, due_date } = data;

    if (semester_id !== undefined && isNaN(Number(semester_id))) {
        error.push('Semester ID must be a number.');
    }

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (fee_name !== undefined && (typeof fee_name !== 'string' || fee_name.trim() === '')) {
        error.push('Fee name must be a non-empty string.');
    }

    if (amount !== undefined && !isValidDecimal(amount)) {
        error.push('Amount must be a non-negative number.');
    }

    if (due_date !== undefined && isNaN(Date.parse(due_date))) {
        error.push('Invalid due date format.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateFeeStructure,
    ValidationUpdateFeeStructure
};
