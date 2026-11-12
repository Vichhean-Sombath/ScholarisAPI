const test = require('node:test');
const assert = require('node:assert/strict');

const {
    ValidationCreateClass,
    ValidationUpdateClass
} = require('../src/modules/classes/classes.validation');
const {
    ValidationLoginUser,
    ValidationRegisterUser
} = require('../src/modules/auth/auth.validation');
const {
    ValidationCreateAttendanceRecord
} = require('../src/modules/attendance_records/attendance_records.validation');
const {
    ValidationCreateCertificate
} = require('../src/modules/certificates/certificates.validation');
const {
    ValidationCreateAcademicYear,
    ValidationUpdateAcademicYear
} = require('../src/modules/academic_years/academic_years.validation');
const {
    ValidationCreateSemester,
    ValidationUpdateSemester
} = require('../src/modules/semesters/semesters.validation');
const {
    ValidationCreateTimeSlot,
    ValidationUpdateTimeSlot
} = require('../src/modules/time_slots/time_slots.validation');

test('class creation validates numbers and trims strings', () => {
    const result = ValidationCreateClass({
        class_name: '  Grade 10 A  ',
        academic_year_id: 2,
        semester_id: 3,
        homeroom_teacher_id: 4,
        max_capacity: 30
    });

    assert.equal(result.success, true);
    assert.deepEqual(result.data, {
        class_name: 'Grade 10 A',
        academic_year_id: 2,
        semester_id: 3,
        homeroom_teacher_id: 4,
        max_capacity: 30
    });
});

test('class creation rejects non-number IDs', () => {
    const result = ValidationCreateClass({
        class_name: 'Grade 10 A',
        academic_year_id: '',
        semester_id: true,
        homeroom_teacher_id: 4
    });

    assert.equal(result.success, false);
    assert.ok(result.error.length > 0);
});

test('class creation returns validation errors instead of throwing on wrong types', () => {
    assert.doesNotThrow(() => ValidationCreateClass({
        class_name: 123,
        academic_year_id: 1,
        semester_id: 1,
        homeroom_teacher_id: 4
    }));

    assert.equal(ValidationCreateClass({
        class_name: 123,
        academic_year_id: 1,
        semester_id: 1,
        homeroom_teacher_id: 4
    }).success, false);
});

test('class schemas reject unknown fields and empty updates', () => {
    assert.equal(ValidationUpdateClass({ class_id: 99 }).success, false);
    assert.equal(ValidationUpdateClass({}).success, false);
});

test('class creation requires a homeroom teacher', () => {
    const missingTeacher = ValidationCreateClass({
        class_name: 'Grade 10 A',
        academic_year_id: 1,
        semester_id: 1
    });
    const nullTeacher = ValidationCreateClass({
        class_name: 'Grade 10 A',
        academic_year_id: 1,
        semester_id: 1,
        homeroom_teacher_id: null
    });

    assert.equal(missingTeacher.success, false);
    assert.equal(nullTeacher.success, false);
    assert.ok(missingTeacher.error.includes('Homeroom teacher required!'));
});

test('login validates email and required password', () => {
    const result = ValidationLoginUser({ email: 'not-an-email', password: '' });

    assert.equal(result.success, false);
    assert.ok(result.error.includes('Invalid email format!'));
    assert.ok(result.error.includes('Password required!'));
});

test('registration applies role-specific minimum age policy', () => {
    const result = ValidationRegisterUser({
        username: 'young_teacher',
        email: 'teacher@example.com',
        password: 'StrongPass1!',
        role: 'Teacher',
        first_name: 'Young',
        last_name: 'Teacher',
        gender: 'Other',
        dob: '2010-01-01',
        contact_number: '012345678',
        photo_url: 'https://example.com/young-teacher.jpg',
        specialization: 'Science',
        hire_date: '2026-09-01'
    });

    assert.equal(result.success, false);
    assert.ok(result.error.includes('Teacher must be at least 25 years old.'));
});

test('attendance accepts the Excused status supported by the model', () => {
    const result = ValidationCreateAttendanceRecord({
        schedule_id: 1,
        student_id: 1,
        attendance_date: '2026-11-11',
        status: 'Excused'
    });

    assert.equal(result.success, true);
});

test('certificate dates require a real YYYY-MM-DD calendar date', () => {
    const result = ValidationCreateCertificate({
        student_id: 1,
        certificate_type: 'Completion',
        issue_date: '2026-02-31',
        issued_by: 1
    });

    assert.equal(result.success, false);
    assert.ok(result.error.includes('Issue date must be a valid date in YYYY-MM-DD format!'));
});

test('academic years require a minimum duration of ten calendar months', () => {
    const exactTenMonths = ValidationCreateAcademicYear({
        year_name: '2026-2027',
        start_date: '2026-09-01',
        end_date: '2027-06-30'
    });
    const shortCreate = ValidationCreateAcademicYear({
        year_name: '2026',
        start_date: '2026-11-09',
        end_date: '2026-11-18'
    });
    const shortUpdate = ValidationUpdateAcademicYear({
        start_date: '2026-11-09',
        end_date: '2026-11-18'
    });

    assert.equal(exactTenMonths.success, true);
    assert.equal(shortCreate.success, false);
    assert.equal(shortUpdate.success, false);
    assert.ok(shortCreate.error.includes('Academic year must be at least 10 months long.'));
});

test('semesters require a minimum duration of three calendar months', () => {
    const exactThreeMonths = ValidationCreateSemester({
        academic_year_id: 1,
        semester_name: 'Semester 1',
        start_date: '2026-09-01',
        end_date: '2026-11-30'
    });
    const shortCreate = ValidationCreateSemester({
        academic_year_id: 1,
        semester_name: 'Semester 1',
        start_date: '2026-09-01',
        end_date: '2026-11-29'
    });
    const shortUpdate = ValidationUpdateSemester({
        start_date: '2026-09-01',
        end_date: '2026-11-29'
    });

    assert.equal(exactThreeMonths.success, true);
    assert.equal(shortCreate.success, false);
    assert.equal(shortUpdate.success, false);
    assert.ok(shortCreate.error.includes('Semester must be at least 3 months long.'));
});

test('time slots require a minimum duration of ninety minutes', () => {
    const exactNinetyMinutes = ValidationCreateTimeSlot({
        day_of_week: 'Mon',
        start_time: '08:00',
        end_time: '09:30'
    });
    const shortCreate = ValidationCreateTimeSlot({
        day_of_week: 'Mon',
        start_time: '08:00',
        end_time: '09:29'
    });
    const shortUpdate = ValidationUpdateTimeSlot({
        start_time: '08:00',
        end_time: '09:29'
    });

    assert.equal(exactNinetyMinutes.success, true);
    assert.equal(shortCreate.success, false);
    assert.equal(shortUpdate.success, false);
    assert.ok(shortCreate.error.includes('Time slot must be at least 1 hour 30 minutes long.'));
});
