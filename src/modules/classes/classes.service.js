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

const ClassEnrollments = require('../../models/class_enrollments.model');

const sharedPopulates = [
    { path: 'academicYear', select: 'academic_year_id year_name' },
    { path: 'semester', select: 'semester_id semester_name' },
    { path: 'homeroomTeacher', select: 'teacher_id first_name last_name' },
    {
        path: 'schedules',
        select: 'schedule_id room_number',
        populate: [
            { path: 'subject', select: 'subject_id subject_code subject_name' },
            { path: 'timeSlot', select: 'time_slot_id day_of_week start_time end_time' }
        ]
    },
    {
        path: 'classEnrollments',
        select: 'enrollment_id student_id',
        populate: {
            path: 'student',
            select: 'student_id first_name last_name user_id',
            populate: {
                path: 'user',
                select: 'user_id email'
            }
        }
    }
];

const GetClassData = async (currentUser) => {
    let query = {};

    if (currentUser && currentUser.role === 'Teacher' && currentUser.teacher_id) {
        const scheduledClassIds = await Schedules.find({
            teacher_id: currentUser.teacher_id
        }).select('class_id').lean().then((rows) => rows.map((row) => row.class_id));

        query = {
            $or: [
                { homeroom_teacher_id: currentUser.teacher_id },
                { class_id: { $in: scheduledClassIds.length > 0 ? scheduledClassIds : [0] } }
            ]
        };
    }

    return await Classes.find(query).populate(sharedPopulates);
};

const SelectedClassData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ class_id: Number(data) });
    }
    orConditions.push({ class_name: { $regex: data, $options: 'i' } });

    const selectedClass = await Classes.findOne({
        $or: orConditions
    }).populate(sharedPopulates);

    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedClass;
};

const CreateClassData = async (classData) => {
    const { class_name, academic_year_id, semester_id, room_number, max_capacity, homeroom_teacher_id } = classData;

    const academicYear = await AcademicYears.findOne({ academic_year_id });
    if (!academicYear) {
        const err = new Error('Academic year not found!');
        err.statusCode = 404;
        throw err;
    }

    const semester = await Semesters.findOne({ semester_id });
    if (!semester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    if (homeroom_teacher_id) {
        const teacher = await Teachers.findOne({ teacher_id: homeroom_teacher_id });
        if (!teacher) {
            const err = new Error('Homeroom teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    let class_id = classData.class_id;
    if (!class_id) {
        const lastClass = await Classes.findOne().sort({ class_id: -1 });
        class_id = lastClass ? lastClass.class_id + 1 : 1;
    }

    const createClass = await Classes.create({
        class_id,
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
    const selectedClass = await Classes.findOne({ class_id });
    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    if (classData.academic_year_id) {
        const academicYear = await AcademicYears.findOne({ academic_year_id: classData.academic_year_id });
        if (!academicYear) {
            const err = new Error('Academic year not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (classData.semester_id) {
        const semester = await Semesters.findOne({ semester_id: classData.semester_id });
        if (!semester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (classData.homeroom_teacher_id) {
        const teacher = await Teachers.findOne({ teacher_id: classData.homeroom_teacher_id });
        if (!teacher) {
            const err = new Error('Homeroom teacher not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(selectedClass, classData);
    await selectedClass.save();

    return selectedClass;
};

const DeleteClassData = async (class_id) => {
    const selectedClass = await Classes.findOne({ class_id });
    if (!selectedClass) {
        const err = new Error('Class not found!');
        err.statusCode = 404;
        throw err;
    }

    await Classes.deleteOne({ class_id });
};

module.exports = {
    GetClassData,
    SelectedClassData,
    CreateClassData,
    UpdateClassData,
    DeleteClassData
};
