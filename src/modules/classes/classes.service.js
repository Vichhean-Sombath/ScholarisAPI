const Classes = require('../../models/classes.model');
const { Op } = require('sequelize');

const GetClassData = async () => {
    const classData = await Classes.findAll();

    return classData;
}

const SelectedClassData = async (data) => {
    const selectedClass = await Classes.findOne({
        where: {
            [Op.or]: [
                { classID: data },
                { classCode: data },
                { className: data }
            ]
        }
    });

    if(!selectedClass){
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedClass;
}

const CreateClassData = async (classData) => {
    const { classCode, className } = classData;

    // Check if class existed
    const existedClassCode = await Classes.findOne({ where: {classCode}});
    const existedClassName = await Classes.findOne({ where: {className}});

    if(existedClassCode){
        const err = new Error('This class code is already existed!');
        err.statusCode = 400;
        throw err;
    }

    if(existedClassName){
        const err = new Error('This class name is already existed!');
        err.statusCode = 400;
        throw err;
    }

    const createClass = await Classes.create({
        classCode,
        className
    })

    return{
        classID: createClass.classID,
        classCode: createClass.classCode,
        className: createClass.className
    }
}

const UpdateClassData = async (classID, classData) => {
    // Check for valid class
    const selectedClass = await Classes.findByPk(classID);
    if(!selectedClass){
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err
    }

    await Classes.update(classData, { where: {classID} });

    return{
        classID: selectedClass.classID,
        ...classData
    }
}

const DeleteClassData = async (classID) => {
    const selectedClass = await Classes.findByPk(classID);
    if(!selectedClass){
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err
    }

    await Classes.destroy({ where: { classID} });
}

module.exports = {
    GetClassData,
    SelectedClassData,
    CreateClassData,
    UpdateClassData,
    DeleteClassData
}