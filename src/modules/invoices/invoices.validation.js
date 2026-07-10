const isValidDecimal = (value) => {
    if (value === undefined || value === null || value === '') return false;
    const num = Number(value);
    return !isNaN(num) && num >= 0;
};

const ValidationCreateInvoice = (data) => {
    const error = [];
    const { invoice_number, student_id, fee_id, semester_id, issue_date, due_date, total_amount, amount_paid, status } = data;

    if (!invoice_number || typeof invoice_number !== 'string' || invoice_number.trim() === '') {
        error.push('Invoice number required and must be a non-empty string.');
    } else if (invoice_number.length > 30) {
        error.push('Invoice number must not exceed 30 characters.');
    }

    if (!student_id || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number.');
    }

    if (!fee_id || isNaN(Number(fee_id))) {
        error.push('Fee ID required and must be a number.');
    }

    if (!semester_id || isNaN(Number(semester_id))) {
        error.push('Semester ID required and must be a number.');
    }

    if (!issue_date || isNaN(Date.parse(issue_date))) {
        error.push('Issue date required and must be a valid date.');
    }

    if (!due_date || isNaN(Date.parse(due_date))) {
        error.push('Due date required and must be a valid date.');
    }

    if (!isValidDecimal(total_amount)) {
        error.push('Total amount required and must be a non-negative number.');
    }

    if (amount_paid !== undefined && !isValidDecimal(amount_paid)) {
        error.push('Amount paid must be a non-negative number.');
    }

    if (status !== undefined && !['Unpaid', 'Partial', 'Paid', 'Overdue'].includes(status)) {
        error.push('Status must be Unpaid, Partial, Paid, or Overdue.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateInvoice = (data) => {
    const error = [];
    const { invoice_number, student_id, fee_id, semester_id, issue_date, due_date, total_amount, amount_paid, status } = data;

    if (invoice_number !== undefined && (typeof invoice_number !== 'string' || invoice_number.trim() === '')) {
        error.push('Invoice number must be a non-empty string.');
    }

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (fee_id !== undefined && isNaN(Number(fee_id))) {
        error.push('Fee ID must be a number.');
    }

    if (semester_id !== undefined && isNaN(Number(semester_id))) {
        error.push('Semester ID must be a number.');
    }

    if (issue_date !== undefined && isNaN(Date.parse(issue_date))) {
        error.push('Invalid issue date format.');
    }

    if (due_date !== undefined && isNaN(Date.parse(due_date))) {
        error.push('Invalid due date format.');
    }

    if (total_amount !== undefined && !isValidDecimal(total_amount)) {
        error.push('Total amount must be a non-negative number.');
    }

    if (amount_paid !== undefined && !isValidDecimal(amount_paid)) {
        error.push('Amount paid must be a non-negative number.');
    }

    if (status !== undefined && !['Unpaid', 'Partial', 'Paid', 'Overdue'].includes(status)) {
        error.push('Status must be Unpaid, Partial, Paid, or Overdue.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateInvoice,
    ValidationUpdateInvoice
};
