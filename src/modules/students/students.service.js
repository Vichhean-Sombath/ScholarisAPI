const Students = require('../../models/students.model');
const StudentEmergencyContacts = require('../../models/student_emergency_contacts.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetStudentData = async () => {
    return await Students.findAll({
        include: [
            {
                model: Users,
                attributes: { exclude: ['password_hash'] }
            },
            {
                model: StudentEmergencyContacts,
                attributes: { exclude: ['student_id'] }
            }
        ]
    });
};

const SelectStudentData = async (data) => {
    const selectedStudent = await Students.findOne({
        where: {
            [Op.or]: [
                { student_id: data },
                { first_name: { [Op.like]: `%${data}%` } },
                { last_name: { [Op.like]: `%${data}%` } },
                { contact_number: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: StudentEmergencyContacts,
            attributes: { exclude: ['student_id'] }
        }]
    });

    if (!selectedStudent) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedStudent;
};

const UpdateStudentData = async (student_id, studentData) => {
    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    if (studentData.enrollment_date !== undefined && isNaN(Date.parse(studentData.enrollment_date))) {
        const err = new Error('Invalid enrollment date!');
        err.statusCode = 400;
        throw err;
    }

    if (studentData.dob !== undefined && isNaN(Date.parse(studentData.dob))) {
        const err = new Error('Invalid date of birth!');
        err.statusCode = 400;
        throw err;
    }

    if (studentData.gender !== undefined && !['Male', 'Female', 'Other'].includes(studentData.gender)) {
        const err = new Error('Gender must be Male, Female, or Other!');
        err.statusCode = 400;
        throw err;
    }

    if (studentData.status !== undefined && !['Active', 'Inactive'].includes(studentData.status)) {
        const err = new Error('Status must be Active or Inactive!');
        err.statusCode = 400;
        throw err;
    }

    await student.update(studentData);

    return student;
};

module.exports = {
    GetStudentData,
    SelectStudentData,
    UpdateStudentData
};
