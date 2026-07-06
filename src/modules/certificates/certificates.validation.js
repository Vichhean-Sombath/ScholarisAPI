const moment = require('moment');

const ValidationCreateCertificate = (data) => {
    const error = [];
    const { studentID, certificateType, certificateDescription, certificateIssuedDate, certificateURL } = data;

    if(!studentID || studentID.toString().trim() === ''){
        error.push('Student ID required!');
    } else if((isNaN(Number(studentID)))){
        error.push('Student ID must be the number!');
    }

    const certificateTypeRegex = /^[A-Za-z0-9\s\-]+$/;
    if (!certificateType || certificateType.trim() === '') {
        error.push('Certificate type required!');
    } else if (!certificateTypeRegex.test(certificateType)) {
        error.push('Certificate type can only contain letters, numbers, spaces, and hyphens!');
    }

    if (!certificateURL || certificateURL.trim() === '') {
        error.push('Certificate URL required!');
    } else {
        try {
            const parsedURL = new URL(certificateURL);
            if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
                error.push('Certificate URL must use http:// or https://!');
            }
        } catch {
            error.push('Certificate URL format is invalid!');
        }
    }

    if(!certificateDescription || certificateDescription.trim() === ''){
        error.push('Certificate description required!');
    }

    if (!certificateIssuedDate || certificateIssuedDate.toString().trim() === '') {
        error.push('Certificate issued date required!');
    } else if (!moment(certificateIssuedDate, 'YYYY-MM-DD', true).isValid()) {
        error.push('Certificate issued date must be a valid date in YYYY-MM-DD format!');
    }

    return error.length > 0
    ? { success: false, error }
    : { success: true, error: null };
}

module.exports = {
    ValidationCreateCertificate
}