const ClassEnrollments = require('../../models/class_enrollments.model');
const Students = require('../../models/students.model');
const Classes = require('../../models/classes.model');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'student', select: 'student_id first_name last_name' },
    { path: 'class', select: 'class_id class_name' }
];

const GetClassEnrollmentData = async () => {
    return await ClassEnrollments.find().populate(sharedPopulates);
};

const SelectedClassEnrollmentData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ enrollment_id: Number(data) });
    }

    const pipeline = [
        {
            $lookup: {
                from: 'students',
                localField: 'student_id',
                foreignField: 'student_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        {
            $lookup: {
                from: 'classes',
                localField: 'class_id',
                foreignField: 'class_id',
                as: 'class'
            }
        },
        { $unwind: '$class' },
        {
            $match: {
                $or: [
                    ...orConditions,
                    { 'student.first_name': { $regex: data, $options: 'i' } },
                    { 'student.last_name': { $regex: data, $options: 'i' } },
                    { 'class.class_name': { $regex: data, $options: 'i' } }
                ]
            }
        }
    ];

    const results = await ClassEnrollments.aggregate(pipeline);
    if (!results.length) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    const selectedEnrollment = await ClassEnrollments.findOne({ enrollment_id: results[0].enrollment_id }).populate(sharedPopulates);
    return selectedEnrollment;
};

const CreateClassEnrollmentData = async (enrollmentData) => {
    const { student_id, class_id, enrollment_date, status } = enrollmentData;

    const student = await Students.findOne({ student_id });
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const classData = await Classes.findOne({ class_id });
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

    let enrollment_id = enrollmentData.enrollment_id;
    if (!enrollment_id) {
        const lastEnroll = await ClassEnrollments.findOne().sort({ enrollment_id: -1 });
        enrollment_id = lastEnroll ? lastEnroll.enrollment_id + 1 : 1;
    }

    const createEnrollment = await ClassEnrollments.create({
        enrollment_id,
        student_id,
        class_id,
        enrollment_date,
        status
    });

    return createEnrollment;
};

const UpdateClassEnrollmentData = async (enrollment_id, enrollmentData) => {
    const selectedEnrollment = await ClassEnrollments.findOne({ enrollment_id });
    if (!selectedEnrollment) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    if (enrollmentData.student_id !== undefined) {
        const student = await Students.findOne({ student_id: enrollmentData.student_id });
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (enrollmentData.class_id !== undefined) {
        const classData = await Classes.findOne({ class_id: enrollmentData.class_id });
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

    Object.assign(selectedEnrollment, enrollmentData);
    await selectedEnrollment.save();

    return selectedEnrollment;
};

const DeleteClassEnrollmentData = async (enrollment_id) => {
    const selectedEnrollment = await ClassEnrollments.findOne({ enrollment_id });
    if (!selectedEnrollment) {
        const err = new Error('Class enrollment not found!');
        err.statusCode = 404;
        throw err;
    }

    await ClassEnrollments.deleteOne({ enrollment_id });
};

module.exports = {
    GetClassEnrollmentData,
    SelectedClassEnrollmentData,
    CreateClassEnrollmentData,
    UpdateClassEnrollmentData,
    DeleteClassEnrollmentData
};
