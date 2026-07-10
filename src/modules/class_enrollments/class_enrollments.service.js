const ClassEnrollments = require('../../models/class_enrollments.model');
const Students = require('../../models/students.model');
const Classes = require('../../models/classes.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetClassEnrollmentData = async () => {
    return await ClassEnrollments.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] }
        ]
    });
};

const SelectedClassEnrollmentData = async (data) => {
    const selectedEnrollment = await ClassEnrollments.findOne({
        where: {
            [Op.or]: [
                { enrollment_id: data },
                { '$Student.first_name$': { [Op.like]: `%${data}%` } },
                { '$Student.last_name$': { [Op.like]: `%${data}%` } },
                { '$Class.class_name$': { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Classes, attributes: ['class_id', 'class_name'] }
        ]
    });

    if (!selectedEnrollment) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedEnrollment;
};

const CreateClassEnrollmentData = async (enrollmentData) => {
    const { student_id, class_id, enrollment_date, status } = enrollmentData;

    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const classData = await Classes.findByPk(class_id);
    if (!classData) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    if (isNaN(Date.parse(enrollment_date))) {
        const err = new Error('Invalid enrollment date!');
        err.statusCode = 400;
        throw err;
    }

    const createEnrollment = await ClassEnrollments.create({
        student_id,
        class_id,
        enrollment_date,
        status
    });

    return createEnrollment;
};

const UpdateClassEnrollmentData = async (enrollment_id, enrollmentData) => {
    const selectedEnrollment = await ClassEnrollments.findByPk(enrollment_id);
    if (!selectedEnrollment) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (enrollmentData.student_id !== undefined) {
        const student = await Students.findByPk(enrollmentData.student_id);
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (enrollmentData.class_id !== undefined) {
        const classData = await Classes.findByPk(enrollmentData.class_id);
        if (!classData) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (enrollmentData.enrollment_date !== undefined && isNaN(Date.parse(enrollmentData.enrollment_date))) {
        const err = new Error('Invalid enrollment date!');
        err.statusCode = 400;
        throw err;
    }

    if (enrollmentData.status !== undefined && !['Active', 'Transferred', 'Withdrawn'].includes(enrollmentData.status)) {
        const err = new Error('Status must be Active, Transferred, or Withdrawn!');
        err.statusCode = 400;
        throw err;
    }

    await selectedEnrollment.update(enrollmentData);

    return selectedEnrollment;
};

const DeleteClassEnrollmentData = async (enrollment_id) => {
    const selectedEnrollment = await ClassEnrollments.findByPk(enrollment_id);
    if (!selectedEnrollment) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedEnrollment.destroy();
};

module.exports = {
    GetClassEnrollmentData,
    SelectedClassEnrollmentData,
    CreateClassEnrollmentData,
    UpdateClassEnrollmentData,
    DeleteClassEnrollmentData
};
