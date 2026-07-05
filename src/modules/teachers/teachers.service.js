const Teachers = require('../../models/teachers.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext'); // For tables relationship
const { Op } = require('sequelize');

// Get
const GetTeacherData = async () => {
    const teacherData = await Teachers.findAll({
        include: {
            model: Users,
            attributes: { exclude: ['userPassword'] } // Hide password
        }
    });

    return teacherData;
}

// Select
const SelectTeacherData = async (data) => {
    const selectedTeacher = await Teachers.findOne({
        where: {
            [Op.or]: [
                { teacherID: data },
                { userID: data },
                { '$Users.userFirstName$': { [Op.like]: `%${data}%` } },
                { '$Users.userLastName$': { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: Users,
            attributes: { exclude: ['userPassword'] }
        }]
    });

    if(!selectedTeacher){
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedTeacher;
}

// Update
const UpdateTeacherData = async (userID, teacherData) => {
    const { teacherPosition } = teacherData;

    const teacher = await Teachers.findOne({ where: {userID} });
    if(!teacher){
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if(!teacherPosition || teacherPosition.trim() === ''){
        const err = new Error('Teacher position is required!');
        err.statusCode = 400;
        throw err;
    }

    await teacher.update({ teacherPosition });

    return {
        teacherID: teacher.teacherID,
        userID: teacher.userID,
        teacherNumber: teacher.teacherNumber,
        teacherPosition,
        hireDate: teacher.hireDate
    };
}

module.exports = {
    GetTeacherData,
    SelectTeacherData,
    UpdateTeacherData,
}