const Students = require('../../models/students.model');
const StudentEmergencyContacts = require('../../models/student_emergency_contacts.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext');

const GetStudentData = async () => {
    return await Students.find()
        .populate({ path: 'user', select: '-password_hash' })
        .populate({ path: 'emergencyContacts', select: '-student_id' });
};

const SelectStudentData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ student_id: Number(data) });
    }
    orConditions.push({ first_name: { $regex: data, $options: 'i' } });
    orConditions.push({ last_name: { $regex: data, $options: 'i' } });
    orConditions.push({ contact_number: { $regex: data, $options: 'i' } });

    const selectedStudent = await Students.findOne({
        $or: orConditions
    }).populate({ path: 'emergencyContacts', select: '-student_id' });

    if (!selectedStudent) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedStudent;
};

const UpdateStudentData = async (student_id, studentData) => {
    const student = await Students.findOne({ student_id });
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

    Object.assign(student, studentData);
    await student.save();

    return student;
};

module.exports = {
    GetStudentData,
    SelectStudentData,
    UpdateStudentData
};
