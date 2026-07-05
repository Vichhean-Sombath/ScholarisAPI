const ValidationCreateClassSubject = (data) => {
    const error = [];
    const { classID, subjectID } = data;

    // Fill require
    if(!classID || classID.toString().trim() === ''){
        error.push('Class ID required!');
    } else if((isNaN(Number(classID)))){
        error.push('Class ID must be the number!');
    }
    
    if(!subjectID || subjectID.toString().trim() === ''){
        error.push('Subject ID required!');
    } else if((isNaN(Number(subjectID)))){
        error.push('Subject ID must be the number!');
    }

    return error.length > 0
    ? { success: false, error }
    : { success: true, error: null };
}

module.exports = {
    ValidationCreateClassSubject,
}