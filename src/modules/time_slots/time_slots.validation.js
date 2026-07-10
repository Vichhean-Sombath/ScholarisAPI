const ValidationCreateTimeSlot = (data) => {
    const error = [];
    const { day_of_week, start_time, end_time } = data;

    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (!day_of_week || !validDays.includes(day_of_week)) {
        error.push('Day of week required and must be one of Mon, Tue, Wed, Thu, Fri, Sat, Sun!');
    }

    if (!start_time || start_time.trim() === '') {
        error.push('Start time required!');
    }

    if (!end_time || end_time.trim() === '') {
        error.push('End time required!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateTimeSlot = (data) => {
    const error = [];
    const { day_of_week, start_time, end_time } = data;

    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    if (day_of_week !== undefined && !validDays.includes(day_of_week)) {
        error.push('Day of week must be one of Mon, Tue, Wed, Thu, Fri, Sat, Sun.');
    }

    if (start_time !== undefined && (typeof start_time !== 'string' || start_time.trim() === '')) {
        error.push('Start time must be a non-empty string.');
    }

    if (end_time !== undefined && (typeof end_time !== 'string' || end_time.trim() === '')) {
        error.push('End time must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateTimeSlot,
    ValidationUpdateTimeSlot
};
