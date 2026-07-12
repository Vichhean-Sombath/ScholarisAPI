const ValidationCreateAttendanceRecord = (data) => {
    const error = [];
    const { schedule_id, student_id, attendance_date, status, marked_by } = data;

    if (schedule_id === undefined || isNaN(Number(schedule_id))) {
        error.push('Schedule ID required and must be a number!');
    }

    if (student_id === undefined || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number!');
    }

    if (!attendance_date || isNaN(Date.parse(attendance_date))) {
        error.push('Attendance date required and must be a valid date!');
    }

    if (!status || !['Present', 'Absent', 'Late'].includes(status)) {
        error.push('Status required and must be Present, Absent, or Late!');
    }

    if (marked_by !== undefined && isNaN(Number(marked_by))) {
        error.push('Marked by (teacher ID) must be a number!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateAttendanceRecord = (data) => {
    const error = [];
    const { schedule_id, student_id, attendance_date, status, marked_by } = data;

    if (schedule_id !== undefined && isNaN(Number(schedule_id))) {
        error.push('Schedule ID must be a number.');
    }

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (attendance_date !== undefined && isNaN(Date.parse(attendance_date))) {
        error.push('Attendance date must be a valid date.');
    }

    if (status !== undefined && !['Present', 'Absent', 'Late'].includes(status)) {
        error.push('Status must be Present, Absent, or Late.');
    }

    if (marked_by !== undefined && isNaN(Number(marked_by))) {
        error.push('Marked by (teacher ID) must be a number.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateAttendanceRecord,
    ValidationUpdateAttendanceRecord
};
