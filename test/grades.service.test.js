const test = require('node:test');
const assert = require('node:assert/strict');

const Grades = require('../src/models/grades.model');
const Assessments = require('../src/models/assessments.model');
const Students = require('../src/models/students.model');
const Teachers = require('../src/models/teachers.model');
const Counters = require('../src/models/counters.model');
const { GetGradeData, CreateGradeData } = require('../src/modules/grades/grades.service');

test('teacher grade retrieval includes the schedule ID needed for ownership filtering', async () => {
    const originalFind = Grades.find;

    try {
        let populateOptions;
        Grades.find = () => ({
            populate(options) {
                populateOptions = options;
                return this;
            },
            async lean() {
                return [{
                    grade_id: 1,
                    assessment: { schedule: { teacher_id: 2 } }
                }];
            }
        });

        const grades = await GetGradeData({ role: 'Teacher', teacher_id: 2 }, 1);

        assert.match(populateOptions[0].select, /\bschedule_id\b/);
        assert.equal(grades.length, 1);
    } finally {
        Grades.find = originalFind;
    }
});

test('concurrent score creation reserves a unique grade ID for every student', async () => {
    const originals = {
        findGrade: Grades.findOne,
        createGrade: Grades.create,
        findAssessment: Assessments.findOne,
        findStudent: Students.findOne,
        findTeacher: Teachers.findOne,
        reserveCounter: Counters.findOneAndUpdate
    };

    try {
        Assessments.findOne = () => ({
            populate: async () => ({
                assessment_id: 3,
                max_score: 100,
                schedule: { teacher_id: 7 }
            })
        });
        Students.findOne = async ({ student_id }) => ({ student_id });
        Teachers.findOne = async ({ teacher_id }) => ({ teacher_id });
        Grades.findOne = (query) => {
            if (query) return Promise.resolve(null);
            return {
                sort() {
                    return this;
                },
                async select() {
                    return { grade_id: 9 };
                }
            };
        };

        let sequence = 9;
        Counters.findOneAndUpdate = async () => ({ sequence_value: ++sequence });

        const createdIds = [];
        Grades.create = async (data) => {
            createdIds.push(data.grade_id);
            return data;
        };

        await Promise.all([11, 12, 13].map((student_id) => CreateGradeData({
            assessment_id: 3,
            student_id,
            score: 80
        }, { role: 'Teacher', teacher_id: 7 })));

        assert.deepEqual(createdIds.sort((a, b) => a - b), [10, 11, 12]);
        assert.equal(new Set(createdIds).size, 3);
    } finally {
        Grades.findOne = originals.findGrade;
        Grades.create = originals.createGrade;
        Assessments.findOne = originals.findAssessment;
        Students.findOne = originals.findStudent;
        Teachers.findOne = originals.findTeacher;
        Counters.findOneAndUpdate = originals.reserveCounter;
    }
});
