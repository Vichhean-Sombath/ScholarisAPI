const Classes = require('../../models/classes.model');
const AcademicYears = require('../../models/academic_years.model');
const Semesters = require('../../models/semesters.model');
const Teachers = require('../../models/teachers.model');
const Students = require('../../models/students.model');
const Users = require('../../models/users.model');
const Subjects = require('../../models/subjects.model');
const TimeSlots = require('../../models/time_slots.model');
const Schedules = require('../../models/schedules.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const ClassEnrollments = require('../../models/class_enrollments.model');

const GetClassData = async (currentUser) => {
    let where = {};

    if (currentUser && currentUser.role === 'Teacher' && currentUser.teacher_id) {
        const scheduledClassIds = await Schedules.findAll({
            where: { teacher_id: currentUser.teacher_id },
            attributes: ['class_id'],
            raw: true
        }).then((rows) => rows.map((row) => row.class_id));

        where = {
            [Op.or]: [
                { homeroom_teacher_id: currentUser.teacher_id },
                { class_id: { [Op.in]: scheduledClassIds.length > 0 ? scheduledClassIds : [0] } }
            ]
        };
    }

    return await Classes.findAll({
        where,
        include: [
            { model: AcademicYears, attributes: ['academic_year_id', 'year_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] },
            { model: Teachers, as: 'HomeroomTeacher', attributes: ['teacher_id', 'first_name', 'last_name'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'room_number'],
                include: [
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
                ]
            },
            {
                model: ClassEnrollments,
                attributes: ['enrollment_id', 'student_id'],
                include: [
                    {
                        model: Students,
                        attributes: ['student_id', 'first_name', 'last_name', 'user_id'],
                        include: [
                            {
                                model: Users,
                                attributes: ['user_id', 'email']
                            }
                        ]
                    }
                ]
            }
        ]
    });
};

const SelectedClassData = async (data) => {
    const selectedClass = await Classes.findOne({
        where: {
            [Op.or]: [
                { class_id: data },
                { class_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: AcademicYears, attributes: ['academic_year_id', 'year_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] },
            { model: Teachers, as: 'HomeroomTeacher', attributes: ['teacher_id', 'first_name', 'last_name'] },
            {
                model: Schedules,
                attributes: ['schedule_id', 'room_number'],
                include: [
                    { model: Subjects, attributes: ['subject_id', 'subject_code', 'subject_name'] },
                    { model: TimeSlots, attributes: ['time_slot_id', 'day_of_week', 'start_time', 'end_time'] }
                ]
            },
            {
                model: ClassEnrollments,
                attributes: ['enrollment_id', 'student_id'],
                include: [
                    {
                        model: Students,
                        attributes: ['student_id', 'first_name', 'last_name', 'user_id'],
                        include: [
                            {
                                model: Users,
                                attributes: ['user_id', 'email']
                            }
                        ]
                    }
                ]
            }
        ]
    });

    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedClass;
};

const CreateClassData = async (classData) => {
    const { class_name, academic_year_id, semester_id, room_number, max_capacity, homeroom_teacher_id } = classData;

    const academicYear = await AcademicYears.findByPk(academic_year_id);
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    const semester = await Semesters.findByPk(semester_id);
    if (!semester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    if (homeroom_teacher_id) {
        const teacher = await Teachers.findByPk(homeroom_teacher_id);
        if (!teacher) {
            const err = new Error('Homeroom teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const createClass = await Classes.create({
        class_name,
        academic_year_id,
        semester_id,
        room_number,
        max_capacity,
        homeroom_teacher_id
    });

    return createClass;
};

const UpdateClassData = async (class_id, classData) => {
    const selectedClass = await Classes.findByPk(class_id);
    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    if (classData.academic_year_id) {
        const academicYear = await AcademicYears.findByPk(classData.academic_year_id);
        if (!academicYear) {
            const err = new Error('Academic year not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (classData.semester_id) {
        const semester = await Semesters.findByPk(classData.semester_id);
        if (!semester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (classData.homeroom_teacher_id) {
        const teacher = await Teachers.findByPk(classData.homeroom_teacher_id);
        if (!teacher) {
            const err = new Error('Homeroom teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedClass.update(classData);

    return selectedClass;
};

const DeleteClassData = async (class_id) => {
    const selectedClass = await Classes.findByPk(class_id);
    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedClass.destroy();
};

module.exports = {
    GetClassData,
    SelectedClassData,
    CreateClassData,
    UpdateClassData,
    DeleteClassData
};
