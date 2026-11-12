const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const moduleRoot = path.join(__dirname, '..', 'src', 'modules');

const validationModules = Object.fromEntries(
    fs.readdirSync(moduleRoot)
        .map((moduleName) => [
            moduleName,
            path.join(moduleRoot, moduleName, `${moduleName}.validation.js`)
        ])
        .filter(([, filePath]) => fs.existsSync(filePath))
        .map(([moduleName, filePath]) => [moduleName, require(filePath)])
);

const validCases = [
    ['academic_years', 'ValidationCreateAcademicYear', {
        year_name: '2026-2027', start_date: '2026-09-01', end_date: '2027-06-30'
    }],
    ['assessments', 'ValidationCreateAssessment', {
        schedule_id: 1, criteria_id: 1, assessment_name: 'Midterm', max_score: 100
    }],
    ['attendance_records', 'ValidationCreateAttendanceRecord', {
        schedule_id: 1, student_id: 1, attendance_date: '2026-11-11', status: 'Present'
    }],
    ['auth', 'ValidationLoginUser', {
        email: 'user@example.com', password: 'password'
    }],
    ['auth', 'ValidationRegisterUser', {
        username: 'student1', email: 'student@example.com', password: 'StrongPass1!',
        role: 'Student', first_name: 'Stu', last_name: 'Dent', dob: '2000-01-01',
        gender: 'Other', contact_number: '012345678', address: '123 School Road',
        photo_url: 'https://example.com/student.jpg', enrollment_date: '2026-09-01'
    }],
    ['certificates', 'ValidationCreateCertificate', {
        student_id: 1, certificate_type: 'Completion', issue_date: '2026-11-11', issued_by: 1
    }],
    ['class_enrollments', 'ValidationCreateClassEnrollment', {
        student_id: 1, class_id: 1, enrollment_date: '2026-09-01'
    }],
    ['classes', 'ValidationCreateClass', {
        class_name: 'Grade 10 A', academic_year_id: 1, semester_id: 1, homeroom_teacher_id: 1
    }],
    ['fee_structures', 'ValidationCreateFeeStructure', {
        semester_id: 1, fee_name: 'Tuition', amount: 150
    }],
    ['final_grades', 'ValidationCreateFinalGrade', {
        student_id: 1, subject_id: 1, class_id: 1, semester_id: 1, final_score: 95
    }],
    ['grades', 'ValidationCreateGrade', {
        assessment_id: 1, student_id: 1, score: 90
    }],
    ['grading_criteria', 'ValidationCreateGradingCriteria', {
        subject_id: 1, component_name: 'Exams', weight_percentage: 50, attempt_count: 1
    }],
    ['invoices', 'ValidationCreateInvoice', {
        invoice_number: 'INV-001', student_id: 1, fee_id: 1, semester_id: 1,
        issue_date: '2026-09-01', due_date: '2026-09-30', total_amount: 100
    }],
    ['lesson_resources', 'ValidationCreateLessonResource', {
        teacher_id: 1, schedule_id: 1, title: 'Lesson 1', resource_type: 'LessonPlan',
        file_url: 'https://example.com/lesson-1.pdf'
    }],
    ['payments', 'ValidationCreatePayment', {
        invoice_id: 1, payment_date: '2026-11-11', amount: 100,
        payment_method: 'stripe', recorded_by: 1
    }],
    ['schedules', 'ValidationCreateSchedule', {
        class_id: 1, subject_id: 1, teacher_id: 1, time_slot_id: 1
    }],
    ['semesters', 'ValidationCreateSemester', {
        academic_year_id: 1, semester_name: 'Semester 1',
        start_date: '2026-09-01', end_date: '2027-01-31'
    }],
    ['student_emergency_contacts', 'ValidationCreateEmergencyContact', {
        student_id: 1, contact_name: 'Parent', phone_number: '012345678'
    }],
    ['students', 'ValidationUpdateStudent', { first_name: 'Updated' }],
    ['subjects', 'ValidationCreateSubject', { subject_code: 'MATH', subject_name: 'Mathematics' }],
    ['teachers', 'ValidationUpdateTeacher', { first_name: 'Updated' }],
    ['time_slots', 'ValidationCreateTimeSlot', {
        day_of_week: 'Mon', start_time: '08:00', end_time: '09:30'
    }],
    ['users', 'ValidationCreateUser', {
        username: 'admin1', email: 'admin@example.com', password: 'StrongPass1!', role: 'Admin'
    }],
    ['users', 'ValidationChangePassword', {
        currentPassword: 'current-password', newPassword: 'NewStrongPass1!'
    }]
];

test('representative valid payloads pass every validation module', () => {
    for (const [moduleName, validatorName, payload] of validCases) {
        const result = validationModules[moduleName][validatorName](payload);
        assert.equal(
            result.success,
            true,
            `${moduleName}.${validatorName}: ${result.error?.join(', ')}`
        );
    }
});

test('all validators handle malformed payloads without throwing', () => {
    for (const [moduleName, moduleExports] of Object.entries(validationModules)) {
        for (const [validatorName, validator] of Object.entries(moduleExports)) {
            if (!validatorName.startsWith('Validation')) continue;

            for (const malformedPayload of [null, 42, []]) {
                assert.doesNotThrow(
                    () => validator(malformedPayload),
                    `${moduleName}.${validatorName} threw for malformed input`
                );
                assert.equal(validator(malformedPayload).success, false);
            }
        }
    }
});

test('update validators reject empty payloads', () => {
    for (const [moduleName, moduleExports] of Object.entries(validationModules)) {
        for (const [validatorName, validator] of Object.entries(moduleExports)) {
            if (!validatorName.startsWith('ValidationUpdate')) continue;

            assert.equal(
                validator({}).success,
                false,
                `${moduleName}.${validatorName} accepted an empty update`
            );
        }
    }
});
