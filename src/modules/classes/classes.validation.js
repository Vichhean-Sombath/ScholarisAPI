const ValidationCreateClass = (data) => {
    const error = [];
    const { classCode, className } = data;

    // Fill require
    const onlyLettersRegex = /^[A-Za-z]+$/;
    const alphaNumericRegex = /^[A-Za-z0-9]+$/;

    if(!className || className.trim() === ''){
        error.push('Class name required!');
    } else if(!onlyLettersRegex.test(className)){
        error.push('Class name can contained only letters!')
    }

    if(!classCode || classCode.trim() === ''){
        error.push('Class code required!');
    } else if(!alphaNumericRegex.test(classCode)){
        error.push('Class code can contained only letters and numbers!');
    }

    return error;
}

module.exports = {
    ValidationCreateClass,
}