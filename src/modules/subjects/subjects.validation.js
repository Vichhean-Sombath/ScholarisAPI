const ValidationCreateSubject = (data) => {
    const error = [];
    const { subjectCode, subjectName } = data;

    // Fill require
    const onlyLettersRegex = /^[A-Za-z]+$/;
    const alphaNumericRegex = /^[A-Za-z0-9]+$/;

    if(!subjectName || subjectName.trim() === ''){
        error.push('Subject name required!');
    } else if(!onlyLettersRegex.test(subjectName)){
        error.push('Subject name can contain only letters!')
    }

    if(!subjectCode || subjectCode.trim() === ''){
        error.push('Subject code required!');
    } else if(!alphaNumericRegex.test(subjectCode)){
        error.push('Subject code can contain only letters and numbers!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
}

const ValidationUpdateSubject = (data) => {
    const error = [];
    const { subjectCode, subjectName } = data;

    if(subjectCode !== undefined && (typeof subjectCode !== 'string' || subjectCode.trim() === '')){
        error.push('Subject code must be a non-empty string.')
    }

    if(subjectName !== undefined && (typeof subjectName !== 'string' || subjectName.trim() === '')){
        error.push('Subject name must be a non-empty string.')
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
}

module.exports = {
    ValidationCreateSubject,
    ValidationUpdateSubject
}