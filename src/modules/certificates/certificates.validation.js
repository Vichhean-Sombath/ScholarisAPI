const moment = require('moment');

const ValidationCreateCertificate = (data) => {
    const error = [];
    const { student_id, certificate_type, template_used, issue_date, generated_file_url, issued_by } = data;

    if (student_id === undefined || student_id === null || student_id.toString().trim() === '') {
        error.push('Student ID required!');
    } else if (isNaN(Number(student_id))) {
        error.push('Student ID must be a number!');
    }

    if (issued_by === undefined || issued_by === null || issued_by.toString().trim() === '') {
        error.push('Issued by user ID required!');
    } else if (isNaN(Number(issued_by))) {
        error.push('Issued by must be a number!');
    }

    if (!certificate_type || certificate_type.trim() === '') {
        error.push('Certificate type required!');
    } else if (!['Completion', 'Transcript', 'Recommendation'].includes(certificate_type)) {
        error.push('Certificate type must be Completion, Transcript, or Recommendation!');
    }

    if (!issue_date || issue_date.toString().trim() === '') {
        error.push('Issue date required!');
    } else if (!moment(issue_date, 'YYYY-MM-DD', true).isValid()) {
        error.push('Issue date must be a valid date in YYYY-MM-DD format!');
    }

    if (generated_file_url !== undefined) {
        if (typeof generated_file_url !== 'string' || generated_file_url.trim() === '') {
            error.push('Generated file URL must be a non-empty string.');
        } else {
            try {
                const parsedURL = new URL(generated_file_url);
                if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
                    error.push('Generated file URL must use http:// or https://!');
                }
            } catch {
                error.push('Generated file URL format is invalid!');
            }
        }
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
};

module.exports = {
    ValidationCreateCertificate
};
