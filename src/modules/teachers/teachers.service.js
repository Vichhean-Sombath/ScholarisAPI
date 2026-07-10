const Teachers = require('../../models/teachers.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetTeacherData = async () => {
    return await Teachers.findAll({
        include: {
            model: Users,
            attributes: { exclude: ['password_hash'] }
        }
    });
};

const SelectTeacherData = async (data) => {
    const selectedTeacher = await Teachers.findOne({
        where: {
            [Op.or]: [
                { teacher_id: data },
                { user_id: data },
                { first_name: { [Op.like]: `%${data}%` } },
                { last_name: { [Op.like]: `%${data}%` } },
                { specialization: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: Users,
            attributes: { exclude: ['password_hash'] }
        }]
    });

    if (!selectedTeacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedTeacher;
};

const UpdateTeacherData = async (teacher_id, teacherData, currentUser) => {
    const teacher = await Teachers.findByPk(teacher_id);
    if (!teacher) {
        const err = new Error('Teacher not found!');
        err.statusCode = 404;
        throw err;
    }

    if (currentUser.role === 'Teacher' && teacher.teacher_id !== currentUser.teacher_id) {
        const err = new Error('Unauthorized!');
        err.statusCode = 403;
        throw err;
    }

    if (teacherData.gender !== undefined && !['Male', 'Female', 'Other'].includes(teacherData.gender)) {
        const err = new Error('Gender must be Male, Female, or Other!');
        err.statusCode = 400;
        throw err;
    }

    if (teacherData.status !== undefined && !['Active', 'Inactive'].includes(teacherData.status)) {
        const err = new Error('Status must be Active or Inactive!');
        err.statusCode = 400;
        throw err;
    }

    if (teacherData.dob !== undefined && isNaN(Date.parse(teacherData.dob))) {
        const err = new Error('Invalid date of birth!');
        err.statusCode = 400;
        throw err;
    }

    if (teacherData.hire_date !== undefined && isNaN(Date.parse(teacherData.hire_date))) {
        const err = new Error('Invalid hire date!');
        err.statusCode = 400;
        throw err;
    }

    await teacher.update(teacherData);

    return teacher;
};

module.exports = {
    GetTeacherData,
    SelectTeacherData,
    UpdateTeacherData
};
