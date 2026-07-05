const ValidationCreateClass = (data) => {
    const error = [];
    const { classCode, className } = data;

    // Fill require
    const onlyLettersRegex = /^[A-Za-z]+$/;
    const alphaNumericRegex = /^[A-Za-z0-9]+$/;

    if(!className || className.trim() === ''){
        error.push('Class name required!');
    } else if(!onlyLettersRegex.test(className)){
        error.push('Class name can contain only letters!')
    }

    if(!classCode || classCode.trim() === ''){
        error.push('Class code required!');
    } else if(!alphaNumericRegex.test(classCode)){
        error.push('Class code can contain only letters and numbers!');
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
}

const ValidationUpdateClass = (data) => {
    const error = [];
    const { classCode, className } = data;

    if(classCode !== undefined && (typeof classCode !== 'string' || classCode.trim() === '')){
        error.push('Class code must be a non-empty string.')
    }

    if(className !== undefined && (typeof className !== 'string' || className.trim() === '')){
        error.push('Class name must be a non-empty string.')
    }

    return error.length > 0
        ? { success: false, error }
        : { success: true, error: null };
}

module.exports = {
    ValidationCreateClass,
    ValidationUpdateClass
}