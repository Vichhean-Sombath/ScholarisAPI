const Teachers = require('../../models/teachers.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext'); // For tables relationship

const GetTeacherData = async (req, res) => {
    const teacherData = await Teachers.findAll({
        include: {
            model: Users,
            attributes: { exclude: ['userPassword'] } // Hide password
        }
    });

    return teacherData;
}

module.exports = {
    GetTeacherData,
}