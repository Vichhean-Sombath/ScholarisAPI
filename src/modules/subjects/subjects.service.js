const Subjects = require('../../models/subjects.model');
const { Op } = require('sequelize');

const GetSubjectData = async () => {
    const subjectData = await subjects.findAll();

    return subjectData;
}

const SelectedSubjectData = async (data) => {
    const selectedSubject = await Subjects.findOne({
        where: {
            [Op.or]: [
                { subjectID: data },
                { subjectCode: data },
                { subjectName: data }
            ]
        }
    });

    if(!selectedSubject){
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedSubject;
}

const CreateSubjectData = async (subjectData) => {
    const { subjectCode, subjectName } = subjectData;

    // Check if subject existed
    const existedSubjectCode = await Subjects.findOne({ where: {subjectCode}});
    const existedSubjectName = await Subjects.findOne({ where: {subjectName}});

    if(existedSubjectCode){
        const err = new Error('This subject code is already existed!');
        err.statusCode = 400;
        throw err;
    }

    if(existedSubjectName){
        const err = new Error('This subject name is already existed!');
        err.statusCode = 400;
        throw err;
    }

    const createSubject = await Subjects.create({
        subjectCode,
        subjectName
    })

    return{
        subjectID: createSubject.subjectID,
        subjectCode: createSubject.subjectCode,
        subjectName: createSubject.subjectName
    }
}

const UpdateSubjectData = async (subjectID, subjectData) => {
    // Check for valid subject
    const selectedSubject = await Subjects.findByPk(subjectID);
    if(!selectedSubject){
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err
    }

    await Subjects.update(subjectData, { where: {subjectID} });

    return{
        subjectID: selectedSubject.subjectID,
        ...subjectData
    }
}

const DeleteSubjectData = async (subjectID) => {
    const selectedSubject = await Subjects.findByPk(subjectID);
    if(!selectedSubject){
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err
    }

    await Subjects.destroy({ where: { subjectID} });
}

module.exports = {
    GetSubjectData,
    SelectedSubjectData,
    CreateSubjectData,
    UpdateSubjectData,
    DeleteSubjectData
}