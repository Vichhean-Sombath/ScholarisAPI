const mongoose = require('mongoose');

const relationsMap = {
    teacher: 'Teacher',
    user: 'User',
    student: 'Student',
    payments: 'Payments',
    certificates: 'Certificates',
    classes: 'Classes',
    schedules: 'Schedules',
    markedAttendances: 'MarkedAttendances',
    enteredGrades: 'EnteredGrades',
    lessonResources: 'LessonResources',
    emergencyContacts: 'EmergencyContacts',
    classEnrollments: 'ClassEnrollments',
    attendanceRecords: 'AttendanceRecords',
    grades: 'Grades',
    finalGrades: 'FinalGrades',
    invoices: 'Invoices',
    semesters: 'Semesters',
    academicYear: 'AcademicYear',
    semester: 'Semester',
    prerequisite: 'Prerequisite',
    dependentSubjects: 'DependentSubjects',
    subject: 'Subject',
    gradingCriteria: 'GradingCriteria',
    homeroomTeacher: 'HomeroomTeacher',
    class: 'Class',
    marker: 'Marker',
    assessments: 'Assessments',
    criteria: 'Criteria',
    enteredBy: 'EnteredBy',
    feeStructure: 'FeeStructure',
    bakongQrRequests: 'BakongQrRequests',
    invoice: 'Invoice',
    schedule: 'Schedule',
    timeSlot: 'TimeSlot',
    recordedBy: 'RecordedBy',
    issuedBy: 'IssuedBy'
};

const mongooseDocToPlain = (val) => {
    if (!val) return val;

    if (Array.isArray(val)) {
        return val.map(mongooseDocToPlain);
    }

    // Check if it's a Mongoose document
    if (val._doc !== undefined && typeof val.toObject === 'function') {
        const plain = {};
        // Copy _doc fields
        for (const [k, v] of Object.entries(val._doc)) {
            plain[k] = mongooseDocToPlain(v);
        }
        const virtualPaths = val.schema ? Object.keys(val.schema.virtuals) : [];
        for (const vp of virtualPaths) {
            if (vp === 'id') continue;
            const vpVal = val[vp];
            if (vpVal !== undefined) {
                plain[vp] = mongooseDocToPlain(vpVal);
            }
        }
        return plain;
    }

    return val;
};

const copyPopulatedFields = (obj) => {
    const visited = new WeakSet();

    const traverse = (node) => {
        if (!node || typeof node !== 'object') return;
        if (visited.has(node)) return;
        visited.add(node);

        if (Array.isArray(node)) {
            node.forEach(traverse);
            return;
        }

        const originalKeys = Object.keys(node);
        for (const key of originalKeys) {
            const val = node[key];
            const upperKey = relationsMap[key];
            if (upperKey && val !== undefined) {
                node[upperKey] = val;
            }
            if (val && typeof val === 'object') {
                traverse(val);
            }
        }
    };

    traverse(obj);
};

const processResponseBody = (body) => {
    if (!body || typeof body !== 'object') return body;

    if (body.data !== undefined) {
        body.data = mongooseDocToPlain(body.data);
    }

    copyPopulatedFields(body);
    return body;
};

module.exports = { processResponseBody, copyPopulatedFields, mongooseDocToPlain };
