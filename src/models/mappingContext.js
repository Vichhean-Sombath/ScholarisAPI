const Users = require('./users.model');
const Teachers = require('./teachers.model');
const Students = require('./students.model');
const StudentEmergencyContacts = require('./student_emergency_contacts.model');
const AcademicYears = require('./academic_years.model');
const Semesters = require('./semesters.model');
const Subjects = require('./subjects.model');
const Classes = require('./classes.model');
const ClassEnrollments = require('./class_enrollments.model');
const TimeSlots = require('./time_slots.model');
const Schedules = require('./schedules.model');
const AttendanceRecords = require('./attendance_records.model');
const GradingCriteria = require('./grading_criteria.model');
const Assessments = require('./assessments.model');
const Grades = require('./grades.model');
const FinalGrades = require('./final_grades.model');
const FeeStructures = require('./fee_structures.model');
const Invoices = require('./invoices.model');
const Payments = require('./payments.model');
const BakongQRRequests = require('./bakong_qr_requests.model');
const Certificates = require('./certificates.model');
const LessonResources = require('./lesson_resources.model');

// ============================================================
// MOCK SEQUELIZE METHODS FOR MONGOOSE COMPATIBILITY
// ============================================================
const mockSequelizeAssociations = (model) => {
    model.hasOne = function () { return this; };
    model.belongsTo = function () { return this; };
    model.hasMany = function () { return this; };
    model.belongsToMany = function () { return this; };
};

const models = [
    Users, Teachers, Students, StudentEmergencyContacts, AcademicYears, Semesters,
    Subjects, Classes, ClassEnrollments, TimeSlots, Schedules, AttendanceRecords,
    GradingCriteria, Assessments, Grades, FinalGrades, FeeStructures, Invoices,
    Payments, BakongQRRequests, Certificates, LessonResources
];

models.forEach(mockSequelizeAssociations);

// ============================================================
// MODULE: Identity & Users (Virtuals)
// ============================================================

Users.schema.virtual('teacher', { ref: 'Teachers', localField: 'user_id', foreignField: 'user_id', justOne: true });
Teachers.schema.virtual('user', { ref: 'Users', localField: 'user_id', foreignField: 'user_id', justOne: true });

Users.schema.virtual('student', { ref: 'Students', localField: 'user_id', foreignField: 'user_id', justOne: true });
Students.schema.virtual('user', { ref: 'Users', localField: 'user_id', foreignField: 'user_id', justOne: true });

Users.schema.virtual('payments', { ref: 'Payments', localField: 'user_id', foreignField: 'recorded_by' });
Payments.schema.virtual('user', { ref: 'Users', localField: 'recorded_by', foreignField: 'user_id', justOne: true });

Users.schema.virtual('certificates', { ref: 'Certificates', localField: 'user_id', foreignField: 'issued_by' });
Certificates.schema.virtual('user', { ref: 'Users', localField: 'issued_by', foreignField: 'user_id', justOne: true });

Students.schema.virtual('emergencyContacts', { ref: 'StudentEmergencyContacts', localField: 'student_id', foreignField: 'student_id' });
StudentEmergencyContacts.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

// ============================================================
// MODULE: Academic Calendar (Virtuals)
// ============================================================

AcademicYears.schema.virtual('semesters', { ref: 'Semesters', localField: 'academic_year_id', foreignField: 'academic_year_id' });
Semesters.schema.virtual('academicYear', { ref: 'AcademicYears', localField: 'academic_year_id', foreignField: 'academic_year_id', justOne: true });

AcademicYears.schema.virtual('classes', { ref: 'Classes', localField: 'academic_year_id', foreignField: 'academic_year_id' });
Classes.schema.virtual('academicYear', { ref: 'AcademicYears', localField: 'academic_year_id', foreignField: 'academic_year_id', justOne: true });

Semesters.schema.virtual('classes', { ref: 'Classes', localField: 'semester_id', foreignField: 'semester_id' });
Classes.schema.virtual('semester', { ref: 'Semesters', localField: 'semester_id', foreignField: 'semester_id', justOne: true });

Semesters.schema.virtual('feeStructures', { ref: 'FeeStructures', localField: 'semester_id', foreignField: 'semester_id' });
FeeStructures.schema.virtual('semester', { ref: 'Semesters', localField: 'semester_id', foreignField: 'semester_id', justOne: true });

Semesters.schema.virtual('invoices', { ref: 'Invoices', localField: 'semester_id', foreignField: 'semester_id' });
Invoices.schema.virtual('semester', { ref: 'Semesters', localField: 'semester_id', foreignField: 'semester_id', justOne: true });

Semesters.schema.virtual('finalGrades', { ref: 'FinalGrades', localField: 'semester_id', foreignField: 'semester_id' });
FinalGrades.schema.virtual('semester', { ref: 'Semesters', localField: 'semester_id', foreignField: 'semester_id', justOne: true });

// ============================================================
// MODULE: Academic Structure (Virtuals)
// ============================================================

Subjects.schema.virtual('prerequisite', { ref: 'Subjects', localField: 'prerequisite_subject_id', foreignField: 'subject_id', justOne: true });
Subjects.schema.virtual('dependentSubjects', { ref: 'Subjects', localField: 'subject_id', foreignField: 'prerequisite_subject_id' });

Subjects.schema.virtual('schedules', { ref: 'Schedules', localField: 'subject_id', foreignField: 'subject_id' });
Schedules.schema.virtual('subject', { ref: 'Subjects', localField: 'subject_id', foreignField: 'subject_id', justOne: true });

Subjects.schema.virtual('gradingCriteria', { ref: 'GradingCriteria', localField: 'subject_id', foreignField: 'subject_id' });
GradingCriteria.schema.virtual('subject', { ref: 'Subjects', localField: 'subject_id', foreignField: 'subject_id', justOne: true });

Subjects.schema.virtual('finalGrades', { ref: 'FinalGrades', localField: 'subject_id', foreignField: 'subject_id' });
FinalGrades.schema.virtual('subject', { ref: 'Subjects', localField: 'subject_id', foreignField: 'subject_id', justOne: true });

Teachers.schema.virtual('classes', { ref: 'Classes', localField: 'teacher_id', foreignField: 'homeroom_teacher_id' });
Classes.schema.virtual('homeroomTeacher', { ref: 'Teachers', localField: 'homeroom_teacher_id', foreignField: 'teacher_id', justOne: true });

Teachers.schema.virtual('schedules', { ref: 'Schedules', localField: 'teacher_id', foreignField: 'teacher_id' });
Schedules.schema.virtual('teacher', { ref: 'Teachers', localField: 'teacher_id', foreignField: 'teacher_id', justOne: true });

Teachers.schema.virtual('markedAttendances', { ref: 'AttendanceRecords', localField: 'teacher_id', foreignField: 'marked_by' });
AttendanceRecords.schema.virtual('marker', { ref: 'Teachers', localField: 'marked_by', foreignField: 'teacher_id', justOne: true });

Teachers.schema.virtual('enteredGrades', { ref: 'Grades', localField: 'teacher_id', foreignField: 'entered_by' });
Grades.schema.virtual('enteredBy', { ref: 'Teachers', localField: 'entered_by', foreignField: 'teacher_id', justOne: true });

Teachers.schema.virtual('lessonResources', { ref: 'LessonResources', localField: 'teacher_id', foreignField: 'teacher_id' });
LessonResources.schema.virtual('teacher', { ref: 'Teachers', localField: 'teacher_id', foreignField: 'teacher_id', justOne: true });

Classes.schema.virtual('classEnrollments', { ref: 'ClassEnrollments', localField: 'class_id', foreignField: 'class_id' });
ClassEnrollments.schema.virtual('class', { ref: 'Classes', localField: 'class_id', foreignField: 'class_id', justOne: true });

Classes.schema.virtual('schedules', { ref: 'Schedules', localField: 'class_id', foreignField: 'class_id' });
Schedules.schema.virtual('class', { ref: 'Classes', localField: 'class_id', foreignField: 'class_id', justOne: true });

Classes.schema.virtual('gradingCriteria', { ref: 'GradingCriteria', localField: 'class_id', foreignField: 'class_id' });
GradingCriteria.schema.virtual('class', { ref: 'Classes', localField: 'class_id', foreignField: 'class_id', justOne: true });

Classes.schema.virtual('finalGrades', { ref: 'FinalGrades', localField: 'class_id', foreignField: 'class_id' });
FinalGrades.schema.virtual('class', { ref: 'Classes', localField: 'class_id', foreignField: 'class_id', justOne: true });

Classes.schema.virtual('feeStructures', { ref: 'FeeStructures', localField: 'class_id', foreignField: 'class_id' });
FeeStructures.schema.virtual('class', { ref: 'Classes', localField: 'class_id', foreignField: 'class_id', justOne: true });

Students.schema.virtual('classEnrollments', { ref: 'ClassEnrollments', localField: 'student_id', foreignField: 'student_id' });
ClassEnrollments.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

Students.schema.virtual('attendanceRecords', { ref: 'AttendanceRecords', localField: 'student_id', foreignField: 'student_id' });
AttendanceRecords.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

Students.schema.virtual('grades', { ref: 'Grades', localField: 'student_id', foreignField: 'student_id' });
Grades.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

Students.schema.virtual('finalGrades', { ref: 'FinalGrades', localField: 'student_id', foreignField: 'student_id' });
FinalGrades.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

Students.schema.virtual('invoices', { ref: 'Invoices', localField: 'student_id', foreignField: 'student_id' });
Invoices.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

Students.schema.virtual('certificates', { ref: 'Certificates', localField: 'student_id', foreignField: 'student_id' });
Certificates.schema.virtual('student', { ref: 'Students', localField: 'student_id', foreignField: 'student_id', justOne: true });

TimeSlots.schema.virtual('schedules', { ref: 'Schedules', localField: 'time_slot_id', foreignField: 'time_slot_id' });
Schedules.schema.virtual('timeSlot', { ref: 'TimeSlots', localField: 'time_slot_id', foreignField: 'time_slot_id', justOne: true });

Schedules.schema.virtual('attendanceRecords', { ref: 'AttendanceRecords', localField: 'schedule_id', foreignField: 'schedule_id' });
AttendanceRecords.schema.virtual('schedule', { ref: 'Schedules', localField: 'schedule_id', foreignField: 'schedule_id', justOne: true });

Schedules.schema.virtual('lessonResources', { ref: 'LessonResources', localField: 'schedule_id', foreignField: 'schedule_id' });
LessonResources.schema.virtual('schedule', { ref: 'Schedules', localField: 'schedule_id', foreignField: 'schedule_id', justOne: true });

// ============================================================
// MODULE: Grading (Virtuals)
// ============================================================

GradingCriteria.schema.virtual('assessments', { ref: 'Assessments', localField: 'criteria_id', foreignField: 'criteria_id' });
Assessments.schema.virtual('criteria', { ref: 'GradingCriteria', localField: 'criteria_id', foreignField: 'criteria_id', justOne: true });
Assessments.schema.virtual('schedule', { ref: 'Schedules', localField: 'schedule_id', foreignField: 'schedule_id', justOne: true });

Assessments.schema.virtual('grades', { ref: 'Grades', localField: 'assessment_id', foreignField: 'assessment_id' });
Grades.schema.virtual('assessment', { ref: 'Assessments', localField: 'assessment_id', foreignField: 'assessment_id', justOne: true });

// ============================================================
// MODULE: Billing (Virtuals)
// ============================================================

FeeStructures.schema.virtual('invoices', { ref: 'Invoices', localField: 'fee_id', foreignField: 'fee_id' });
Invoices.schema.virtual('feeStructure', { ref: 'FeeStructures', localField: 'fee_id', foreignField: 'fee_id', justOne: true });

Invoices.schema.virtual('payments', { ref: 'Payments', localField: 'invoice_id', foreignField: 'invoice_id' });
Payments.schema.virtual('invoice', { ref: 'Invoices', localField: 'invoice_id', foreignField: 'invoice_id', justOne: true });

Invoices.schema.virtual('bakongQrRequests', { ref: 'BakongQRRequests', localField: 'invoice_id', foreignField: 'invoice_id' });
BakongQRRequests.schema.virtual('invoice', { ref: 'Invoices', localField: 'invoice_id', foreignField: 'invoice_id', justOne: true });

// ============================================================
// Re-apply virtuals serialization AFTER all virtuals are defined.
// This ensures populated virtuals appear in toJSON/toObject output.
// ============================================================
models.forEach(model => {
    model.schema.set('toJSON', { virtuals: true });
    model.schema.set('toObject', { virtuals: true });
});

module.exports = {
    Users,
    Teachers,
    Students,
    StudentEmergencyContacts,
    AcademicYears,
    Semesters,
    Subjects,
    Classes,
    ClassEnrollments,
    TimeSlots,
    Schedules,
    AttendanceRecords,
    GradingCriteria,
    Assessments,
    Grades,
    FinalGrades,
    FeeStructures,
    Invoices,
    Payments,
    BakongQRRequests,
    Certificates,
    LessonResources
};
