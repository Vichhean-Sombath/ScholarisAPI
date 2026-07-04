const Students = require('../../models/students.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext'); // For tables relationship

const GetStudentData = async (req, res) => {
    const studentData = await Students.findAll({
        include: {
            model: Users,
            attributes: { exclude: ['userPassword'] } // Hide password
        }
    });

    return studentData;
};

module.exports = {
    GetStudentData,
}