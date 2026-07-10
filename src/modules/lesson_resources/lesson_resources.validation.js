const ValidationCreateLessonResource = (data) => {
    const error = [];
    const { schedule_id, teacher_id, title, description, resource_type, file_url, upload_date } = data;

    if (teacher_id === undefined || teacher_id === null || isNaN(Number(teacher_id))) {
        error.push('Teacher ID required and must be a number!');
    }

    if (schedule_id !== undefined && isNaN(Number(schedule_id))) {
        error.push('Schedule ID must be a number.');
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
        error.push('Title required and must be a non-empty string.');
    } else if (title.length > 150) {
        error.push('Title must not exceed 150 characters.');
    }

    if (!resource_type || !['LessonPlan', 'Homework', 'Syllabus', 'Other'].includes(resource_type)) {
        error.push('Resource type required and must be LessonPlan, Homework, Syllabus, or Other.');
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        error.push('Description must be a non-empty string.');
    }

    if (file_url !== undefined && (typeof file_url !== 'string' || file_url.trim() === '')) {
        error.push('File URL must be a non-empty string.');
    }

    if (upload_date !== undefined && isNaN(Date.parse(upload_date))) {
        error.push('Invalid upload date format.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateLessonResource = (data) => {
    const error = [];
    const { schedule_id, teacher_id, title, description, resource_type, file_url, upload_date } = data;

    if (teacher_id !== undefined && isNaN(Number(teacher_id))) {
        error.push('Teacher ID must be a number.');
    }

    if (schedule_id !== undefined && isNaN(Number(schedule_id))) {
        error.push('Schedule ID must be a number.');
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        error.push('Title must be a non-empty string.');
    }

    if (resource_type !== undefined && !['LessonPlan', 'Homework', 'Syllabus', 'Other'].includes(resource_type)) {
        error.push('Resource type must be LessonPlan, Homework, Syllabus, or Other.');
    }

    if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
        error.push('Description must be a non-empty string.');
    }

    if (file_url !== undefined && (typeof file_url !== 'string' || file_url.trim() === '')) {
        error.push('File URL must be a non-empty string.');
    }

    if (upload_date !== undefined && isNaN(Date.parse(upload_date))) {
        error.push('Invalid upload date format.');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateLessonResource,
    ValidationUpdateLessonResource
};
