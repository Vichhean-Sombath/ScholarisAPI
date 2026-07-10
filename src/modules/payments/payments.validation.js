const isValidPositiveDecimal = (value) => {
    if (value === undefined || value === null || value === '') return false;
    const num = Number(value);
    return !isNaN(num) && num > 0;
};

const ValidationCreatePayment = (data) => {
    const error = [];
    const { invoice_id, payment_date, amount, payment_method, receipt_url, recorded_by, notes } = data;

    if (invoice_id === undefined || invoice_id === null || isNaN(Number(invoice_id))) {
        error.push('Invoice ID required and must be a number.');
    }

    if (!payment_date || isNaN(Date.parse(payment_date))) {
        error.push('Payment date required and must be a valid date.');
    }

    if (!isValidPositiveDecimal(amount)) {
        error.push('Amount required and must be a positive number.');
    }

    if (!payment_method || !['Cash', 'ABA', 'BankTransfer', 'Check'].includes(payment_method)) {
        error.push('Payment method required and must be Cash, ABA, BankTransfer, or Check.');
    }

    if (recorded_by === undefined || recorded_by === null || isNaN(Number(recorded_by))) {
        error.push('Recorded by required and must be a number.');
    }

    if (receipt_url !== undefined && (typeof receipt_url !== 'string' || receipt_url.trim() === '')) {
        error.push('Receipt URL must be a non-empty string.');
    }

    if (notes !== undefined && (typeof notes !== 'string' || notes.trim() === '')) {
        error.push('Notes must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdatePayment = (data) => {
    const error = [];
    const { invoice_id, payment_date, amount, payment_method, receipt_url, recorded_by, notes } = data;

    if (invoice_id !== undefined && isNaN(Number(invoice_id))) {
        error.push('Invoice ID must be a number.');
    }

    if (payment_date !== undefined && isNaN(Date.parse(payment_date))) {
        error.push('Invalid payment date format.');
    }

    if (amount !== undefined && !isValidPositiveDecimal(amount)) {
        error.push('Amount must be a positive number.');
    }

    if (payment_method !== undefined && !['Cash', 'ABA', 'BankTransfer', 'Check'].includes(payment_method)) {
        error.push('Payment method must be Cash, ABA, BankTransfer, or Check.');
    }

    if (recorded_by !== undefined && isNaN(Number(recorded_by))) {
        error.push('Recorded by must be a number.');
    }

    if (receipt_url !== undefined && (typeof receipt_url !== 'string' || receipt_url.trim() === '')) {
        error.push('Receipt URL must be a non-empty string.');
    }

    if (notes !== undefined && (typeof notes !== 'string' || notes.trim() === '')) {
        error.push('Notes must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreatePayment,
    ValidationUpdatePayment
};
