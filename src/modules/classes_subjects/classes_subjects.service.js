const Classes = require('../../models/classes.model');
const Subjects = require('../../models/subjects.model');
const ClassSubject = require('../../models/class_subjects.model');
require('../../models/mappingContext');

const GetClassSubjectData = async () => {
    const classSubject = await ClassSubject.findAll({
        include: [
            { model: Classes, attributes: [ 'classID', 'classCode', 'className'] },
            { model: Subjects, attributes: [ 'subjectID', 'subjectCode', 'subjectName'] },
        ]
    });

    return classSubject;
}

const SelectClassSubjectData = async (classSubjectID) => {
    const selectedClassSubject = await ClassSubject.findByPk(classSubjectID, {
        include: [
            { model: Classes, attributes: [ 'classID', 'classCode', 'className'] },
            { model: Subjects, attributes: [ 'subjectID', 'subjectCode', 'subjectName'] },
        ]
    });

    if(!selectedClassSubject) {
        const err = new Error('Class subject not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedClassSubject;
}

const CreateSubjectClassData = async (data) => {
    const  { classID, subjectID } = data;

    const selectedClassID = await Classes.findByPk(classID);
    if(!selectedClassID){
        const err = new Error('Class ID not found!');
        err.statusCode = 404;
        throw err;
    }

    const selectedSubjectID = await Subjects.findByPk(subjectID);
    if(!selectedSubjectID){
        const err = new Error('Subject ID not found!');
        err.statusCode = 404;
        throw err;
    }

    // Check duplicate
    const existedClassSubject = await ClassSubject.findOne({
        where: { classID, subjectID }
    });

    if(existedClassSubject){
        const err = new Error('Class Subject is already existed!');
        err.statusCode = 400;
        throw err;
    }

    const createClassSubject = await ClassSubject.create({ classID, subjectID });

    return{
        classSubjectID: createClassSubject.classSubjectID,
        classID: createClassSubject.classID,
        subjectID: createClassSubject.subjectID
    }
}

// Delete
const DeleteClassSubjectData = async (classSubjectID) => {
    const selectedClassSubject = await ClassSubject.findByPk(classSubjectID);

    if(!selectedClassSubject){
        const err = new Error('Class Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    await ClassSubject.destroy({ where: {classSubjectID}});
}

module.exports = {
    GetClassSubjectData,
    SelectClassSubjectData,
    CreateSubjectClassData,
    DeleteClassSubjectData
}