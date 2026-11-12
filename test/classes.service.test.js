const test = require('node:test');
const assert = require('node:assert/strict');

const Classes = require('../src/models/classes.model');
const {
    CreateClassData,
    UpdateClassData
} = require('../src/modules/classes/classes.service');

test('class service requires a homeroom teacher on create and prevents clearing it', async () => {
    const originalFindOne = Classes.findOne;

    try {
        await assert.rejects(
            CreateClassData({
                class_name: 'Grade 10 A',
                academic_year_id: 1,
                semester_id: 1
            }),
            (error) => error.statusCode === 400
                && error.message === 'Homeroom teacher required!'
        );

        Classes.findOne = async () => ({
            class_id: 1,
            homeroom_teacher_id: 4,
            save: async () => {}
        });

        await assert.rejects(
            UpdateClassData(1, { homeroom_teacher_id: null }),
            (error) => error.statusCode === 400
                && error.message === 'Homeroom teacher required!'
        );
    } finally {
        Classes.findOne = originalFindOne;
    }
});
