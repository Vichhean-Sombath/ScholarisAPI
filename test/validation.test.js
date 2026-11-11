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

test('class creation validates numbers and trims strings', () => {
    const result = ValidationCreateClass({
        class_name: '  Grade 10 A  ',
        academic_year_id: 2,
        semester_id: 3,
        max_capacity: 30
    });

    assert.equal(result.success, true);
    assert.deepEqual(result.data, {
        class_name: 'Grade 10 A',
        academic_year_id: 2,
        semester_id: 3,
        max_capacity: 30
    });
});

test('class creation rejects non-number IDs', () => {
    const result = ValidationCreateClass({
        class_name: 'Grade 10 A',
        academic_year_id: '',
        semester_id: true
    });

    assert.equal(result.success, false);
    assert.ok(result.error.length > 0);
});

test('class creation returns validation errors instead of throwing on wrong types', () => {
    assert.doesNotThrow(() => ValidationCreateClass({
        class_name: 123,
        academic_year_id: 1,
        semester_id: 1
    }));

    assert.equal(ValidationCreateClass({
        class_name: 123,
        academic_year_id: 1,
        semester_id: 1
    }).success, false);
});

test('class schemas reject unknown fields and empty updates', () => {
    assert.equal(ValidationUpdateClass({ class_id: 99 }).success, false);
    assert.equal(ValidationUpdateClass({}).success, false);
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
        dob: '2010-01-01',
        contact_number: '012345678'
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
