const test = require('node:test');
const assert = require('node:assert/strict');

const Students = require('../src/models/students.model');
const Teachers = require('../src/models/teachers.model');
const { ValidationRegisterUser } = require('../src/modules/auth/auth.validation');
const { ValidationCreateUser } = require('../src/modules/users/users.validation');

const accountFields = {
    username: 'profile_user',
    email: 'profile@example.com',
    password: 'StrongPass1!'
};

const studentFields = {
    role: 'Student',
    first_name: 'Stu',
    last_name: 'Dent',
    gender: 'Other',
    dob: '2000-01-01',
    contact_number: '012345678',
    address: '123 School Road',
    enrollment_date: '2026-09-01'
};

const teacherFields = {
    role: 'Teacher',
    first_name: 'Tea',
    last_name: 'Cher',
    gender: 'Female',
    dob: '1990-01-01',
    contact_number: '098765432',
    specialization: 'Mathematics',
    hire_date: '2026-09-01'
};

const profileRequiredFields = {
    Student: ['first_name', 'last_name', 'gender', 'dob', 'contact_number', 'address', 'enrollment_date'],
    Teacher: ['first_name', 'last_name', 'gender', 'dob', 'contact_number', 'specialization', 'hire_date']
};

for (const [role, profile] of Object.entries({ Student: studentFields, Teacher: teacherFields })) {
    test(`${role.toLowerCase()} creation enforces its required profile fields`, () => {
        for (const validator of [ValidationRegisterUser, ValidationCreateUser]) {
            assert.equal(validator({ ...accountFields, ...profile }).success, true);

            for (const field of profileRequiredFields[role]) {
                const payload = { ...accountFields, ...profile };
                delete payload[field];

                assert.equal(validator(payload).success, false, `${validator.name} accepted missing ${field}`);
            }
        }
    });
}

test('models enforce profile fields while photos and teacher bio stay optional', async () => {
    const student = new Students({ user_id: 1, ...studentFields });
    const teacher = new Teachers({ user_id: 2, ...teacherFields });

    assert.equal(student.bio, undefined);
    assert.equal(teacher.bio, undefined);
    await assert.doesNotReject(student.validate());
    await assert.doesNotReject(teacher.validate());

    student.address = undefined;
    teacher.specialization = undefined;

    await assert.rejects(student.validate(), (error) => Boolean(error.errors.address));
    await assert.rejects(teacher.validate(), (error) => Boolean(error.errors.specialization));
});
