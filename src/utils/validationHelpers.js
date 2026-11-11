const Users = require('../models/users.model');
const Teachers = require('../models/teachers.model');
const Students = require('../models/students.model');

const todayString = () => new Date().toISOString().slice(0, 10);

const checkDuplicateEmail = async (email, excludeUserId = null) => {
    const query = { email };
    if (excludeUserId) {
        query.user_id = { $ne: excludeUserId };
    }
    return await Users.findOne(query);
};

const checkDuplicatePhone = async (phone, excludeUserId = null) => {
    const query = { contact_number: phone };
    if (excludeUserId) {
        query.user_id = { $ne: excludeUserId };
    }
    const teacher = await Teachers.findOne(query);
    if (teacher) return { type: 'teacher', record: teacher };
    const student = await Students.findOne(query);
    if (student) return { type: 'student', record: student };
    return null;
};

module.exports = {
    todayString,
    checkDuplicateEmail,
    checkDuplicatePhone
};
