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
const Certificates = require('./certificates.model');
const LessonResources = require('./lesson_resources.model');

// ============================================================
// MODULE: Identity & Users
// ============================================================

Users.hasOne(Teachers, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Teachers.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasOne(Students, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Students.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasMany(Payments, { foreignKey: 'recorded_by', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Payments.belongsTo(Users, { foreignKey: 'recorded_by' });

Users.hasMany(Certificates, { foreignKey: 'issued_by', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Certificates.belongsTo(Users, { foreignKey: 'issued_by' });

Students.hasMany(StudentEmergencyContacts, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
StudentEmergencyContacts.belongsTo(Students, { foreignKey: 'student_id' });

// ============================================================
// MODULE: Academic Calendar
// ============================================================

AcademicYears.hasMany(Semesters, { foreignKey: 'academic_year_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Semesters.belongsTo(AcademicYears, { foreignKey: 'academic_year_id' });

AcademicYears.hasMany(Classes, { foreignKey: 'academic_year_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Classes.belongsTo(AcademicYears, { foreignKey: 'academic_year_id' });

Semesters.hasMany(Classes, { foreignKey: 'semester_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Classes.belongsTo(Semesters, { foreignKey: 'semester_id' });

Semesters.hasMany(FeeStructures, { foreignKey: 'semester_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FeeStructures.belongsTo(Semesters, { foreignKey: 'semester_id' });

Semesters.hasMany(Invoices, { foreignKey: 'semester_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Invoices.belongsTo(Semesters, { foreignKey: 'semester_id' });

Semesters.hasMany(FinalGrades, { foreignKey: 'semester_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
FinalGrades.belongsTo(Semesters, { foreignKey: 'semester_id' });

// ============================================================
// MODULE: Academic Structure
// ============================================================

Subjects.belongsTo(Subjects, { as: 'Prerequisite', foreignKey: 'prerequisite_subject_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Subjects.hasMany(Subjects, { as: 'DependentSubjects', foreignKey: 'prerequisite_subject_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

Subjects.hasMany(Schedules, { foreignKey: 'subject_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Schedules.belongsTo(Subjects, { foreignKey: 'subject_id' });

Subjects.hasMany(GradingCriteria, { foreignKey: 'subject_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
GradingCriteria.belongsTo(Subjects, { foreignKey: 'subject_id' });

Subjects.hasMany(FinalGrades, { foreignKey: 'subject_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
FinalGrades.belongsTo(Subjects, { foreignKey: 'subject_id' });

Teachers.hasMany(Classes, { foreignKey: 'homeroom_teacher_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Classes.belongsTo(Teachers, { as: 'HomeroomTeacher', foreignKey: 'homeroom_teacher_id' });

Teachers.hasMany(Schedules, { foreignKey: 'teacher_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Schedules.belongsTo(Teachers, { foreignKey: 'teacher_id' });

Teachers.hasMany(AttendanceRecords, { foreignKey: 'marked_by', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
AttendanceRecords.belongsTo(Teachers, { as: 'Marker', foreignKey: 'marked_by' });

Teachers.hasMany(Grades, { foreignKey: 'entered_by', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Grades.belongsTo(Teachers, { as: 'EnteredBy', foreignKey: 'entered_by' });

Teachers.hasMany(LessonResources, { foreignKey: 'teacher_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
LessonResources.belongsTo(Teachers, { foreignKey: 'teacher_id' });

Classes.hasMany(ClassEnrollments, { foreignKey: 'class_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ClassEnrollments.belongsTo(Classes, { foreignKey: 'class_id' });

Classes.hasMany(Schedules, { foreignKey: 'class_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Schedules.belongsTo(Classes, { foreignKey: 'class_id' });

Classes.hasMany(GradingCriteria, { foreignKey: 'class_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
GradingCriteria.belongsTo(Classes, { foreignKey: 'class_id' });

Assessments.belongsTo(Schedules, { foreignKey: 'schedule_id' });

Classes.hasMany(FinalGrades, { foreignKey: 'class_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
FinalGrades.belongsTo(Classes, { foreignKey: 'class_id' });

Classes.hasMany(FeeStructures, { foreignKey: 'class_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FeeStructures.belongsTo(Classes, { foreignKey: 'class_id' });

Students.hasMany(ClassEnrollments, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ClassEnrollments.belongsTo(Students, { foreignKey: 'student_id' });

Students.hasMany(AttendanceRecords, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
AttendanceRecords.belongsTo(Students, { foreignKey: 'student_id' });

Students.hasMany(Grades, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Grades.belongsTo(Students, { foreignKey: 'student_id' });

Students.hasMany(FinalGrades, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
FinalGrades.belongsTo(Students, { foreignKey: 'student_id' });

Students.hasMany(Invoices, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Invoices.belongsTo(Students, { foreignKey: 'student_id' });

Students.hasMany(Certificates, { foreignKey: 'student_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Certificates.belongsTo(Students, { foreignKey: 'student_id' });

TimeSlots.hasMany(Schedules, { foreignKey: 'time_slot_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Schedules.belongsTo(TimeSlots, { foreignKey: 'time_slot_id' });

Schedules.hasMany(AttendanceRecords, { foreignKey: 'schedule_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
AttendanceRecords.belongsTo(Schedules, { foreignKey: 'schedule_id' });

Schedules.hasMany(LessonResources, { foreignKey: 'schedule_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
LessonResources.belongsTo(Schedules, { foreignKey: 'schedule_id' });

// ============================================================
// MODULE: Grading
// ============================================================

GradingCriteria.hasMany(Assessments, { foreignKey: 'criteria_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Assessments.belongsTo(GradingCriteria, { foreignKey: 'criteria_id' });

Assessments.hasMany(Grades, { foreignKey: 'assessment_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Grades.belongsTo(Assessments, { foreignKey: 'assessment_id' });

// ============================================================
// MODULE: Billing
// ============================================================

FeeStructures.hasMany(Invoices, { foreignKey: 'fee_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Invoices.belongsTo(FeeStructures, { foreignKey: 'fee_id' });

Invoices.hasMany(Payments, { foreignKey: 'invoice_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Payments.belongsTo(Invoices, { foreignKey: 'invoice_id' });

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
    Certificates,
    LessonResources
};
