const ValidationCreateEmergencyContact = (data) => {
    const error = [];
    const { student_id, contact_name, phone_number } = data;

    if (student_id === undefined || isNaN(Number(student_id))) {
        error.push('Student ID required and must be a number!');
    }

    if (!contact_name || typeof contact_name !== 'string' || contact_name.trim() === '') {
        error.push('Contact name required and must be a non-empty string!');
    }

    if (!phone_number || typeof phone_number !== 'string' || phone_number.trim() === '') {
        error.push('Phone number required and must be a non-empty string!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

const ValidationUpdateEmergencyContact = (data) => {
    const error = [];
    const { student_id, contact_name, relationship, phone_number, email } = data;

    if (student_id !== undefined && isNaN(Number(student_id))) {
        error.push('Student ID must be a number.');
    }

    if (contact_name !== undefined && (typeof contact_name !== 'string' || contact_name.trim() === '')) {
        error.push('Contact name must be a non-empty string.');
    }

    if (relationship !== undefined && (typeof relationship !== 'string' || relationship.trim() === '')) {
        error.push('Relationship must be a non-empty string.');
    }

    if (phone_number !== undefined && (typeof phone_number !== 'string' || phone_number.trim() === '')) {
        error.push('Phone number must be a non-empty string.');
    }

    if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || email.trim() === '' || !emailRegex.test(email)) {
            error.push('Email must be a valid email address.');
        }
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateEmergencyContact,
    ValidationUpdateEmergencyContact
};
