const Students = require('../../models/students.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext'); // For tables relationship
const { Op } = require('sequelize');

// Get
const GetStudentData = async () => {
    const studentData = await Students.findAll({
        include: {
            model: Users,
            attributes: { exclude: ['userPassword'] } // Hide password
        }
    });

    return studentData;
};

// Select
const SelectStudentData = async (data) => {
    const selectedStudent = await Students.findOne({
        where: {
            [Op.or]: [
                { studentID: data },
                { userID: data },
                { '$Users.userFirstName$': { [Op.like]: `%${data}%` } },
                { '$Users.userLastName$':  { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: Users,
            attributes: { exclude: ['userPassword'] }
        }]
    });

    if(!selectedStudent){
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedStudent;
}

// Update
const UpdateStudentData = async(userID, studentData) => {
    const { studentNumber, enrollmentDate } = studentData;

    const student = await Students.findOne({ where: {userID} });
    if(!student){
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    // Validate fields if provided
    if (studentData.studentNumber !== undefined && studentData.studentNumber.trim() === '') {
        const err = new Error('Student number must not be empty!');
        err.statusCode = 400;
        throw err;
    }

    if (studentData.enrollmentDate !== undefined && isNaN(Date.parse(studentData.enrollmentDate))) {
        const err = new Error('Invalid enrollment date!');
        err.statusCode = 400;
        throw err;
    }

    await student.update(studentData);

    return {
        studentID: student.studentID,
        userID: student.userID,
        studentNumber: student.studentNumber,
        enrollmentDate: student.enrollmentDate
    };
}

module.exports = {
    GetStudentData,
    SelectStudentData,
    UpdateStudentData
}