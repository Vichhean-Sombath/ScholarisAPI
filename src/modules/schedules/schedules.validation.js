const ValidationCreateSchedule = (data) => {
    const error = [];
    const { class_id, subject_id, teacher_id, time_slot_id, room_number } = data;

    if (!class_id || isNaN(Number(class_id))) {
        error.push('Class ID required and must be a number!');
    }

    if (!subject_id || isNaN(Number(subject_id))) {
        error.push('Subject ID required and must be a number!');
    }

    if (!teacher_id || isNaN(Number(teacher_id))) {
        error.push('Teacher ID required and must be a number!');
    }

    if (!time_slot_id || isNaN(Number(time_slot_id))) {
        error.push('Time slot ID required and must be a number!');
    }

    if (room_number !== undefined && (typeof room_number !== 'string' || room_number.trim() === '')) {
        error.push('Room number must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateSchedule = (data) => {
    const error = [];
    const { class_id, subject_id, teacher_id, time_slot_id, room_number } = data;

    if (class_id !== undefined && isNaN(Number(class_id))) {
        error.push('Class ID must be a number.');
    }

    if (subject_id !== undefined && isNaN(Number(subject_id))) {
        error.push('Subject ID must be a number.');
    }

    if (teacher_id !== undefined && isNaN(Number(teacher_id))) {
        error.push('Teacher ID must be a number.');
    }

    if (time_slot_id !== undefined && isNaN(Number(time_slot_id))) {
        error.push('Time slot ID must be a number.');
    }

    if (room_number !== undefined && (typeof room_number !== 'string' || room_number.trim() === '')) {
        error.push('Room number must be a non-empty string.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateSchedule,
    ValidationUpdateSchedule
};
