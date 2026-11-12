const test = require('node:test');
const assert = require('node:assert/strict');

const LessonResources = require('../src/models/lesson_resources.model');
const Schedules = require('../src/models/schedules.model');
const Teachers = require('../src/models/teachers.model');
const {
    GetLessonResourceData,
    CreateLessonResourceData,
    UpdateLessonResourceData,
    DeleteLessonResourceData
} = require('../src/modules/lesson_resources/lesson_resources.service');
const {
    ValidationCreateLessonResource
} = require('../src/modules/lesson_resources/lesson_resources.validation');

test('teacher resource creation does not require a teacher ID in the request body', () => {
    const validation = ValidationCreateLessonResource({
        schedule_id: 3,
        title: 'Lesson plan',
        resource_type: 'LessonPlan',
        file_url: 'https://example.com/lesson-plan.pdf'
    });

    assert.equal(validation.success, true);
});

test('teacher dashboard resource payload accepts a string schedule ID', () => {
    const validation = ValidationCreateLessonResource({
        schedule_id: '3',
        title: 'Lesson plan',
        description: '',
        resource_type: 'LessonPlan',
        file_url: 'https://example.com/lesson-plan.pdf',
        upload_date: '2026-11-12'
    });

    assert.equal(validation.success, true);
    assert.equal(validation.data.schedule_id, 3);
    assert.equal(validation.data.description, undefined);
});

test('teacher resource creation requires a schedule and resource URL', () => {
    const missingSchedule = ValidationCreateLessonResource({
        title: 'Lesson plan',
        resource_type: 'LessonPlan',
        file_url: 'https://example.com/lesson-plan.pdf'
    });
    const missingUrl = ValidationCreateLessonResource({
        schedule_id: 3,
        title: 'Lesson plan',
        resource_type: 'LessonPlan'
    });

    assert.equal(missingSchedule.success, false);
    assert.equal(missingUrl.success, false);
    assert.deepEqual(missingSchedule.error, ['Schedule ID is required.']);
    assert.deepEqual(missingUrl.error, ['Resource URL is required.']);
});

test('resource URL validation returns one precise server message', () => {
    const invalidUrl = ValidationCreateLessonResource({
        schedule_id: 3,
        title: 'Lesson plan',
        resource_type: 'LessonPlan',
        file_url: 'not-a-url'
    });
    const unsupportedProtocol = ValidationCreateLessonResource({
        schedule_id: 3,
        title: 'Lesson plan',
        resource_type: 'LessonPlan',
        file_url: 'ftp://example.com/lesson-plan.pdf'
    });

    assert.deepEqual(invalidUrl.error, ['Resource URL format is invalid.']);
    assert.deepEqual(unsupportedProtocol.error, ['Resource URL must use http:// or https://.']);
});

test('admin resource creation requires a teacher ID', async () => {
    await assert.rejects(
        CreateLessonResourceData({
            schedule_id: 3,
            title: 'Lesson plan',
            resource_type: 'LessonPlan',
            file_url: 'https://example.com/lesson-plan.pdf'
        }, { role: 'Admin' }),
        (error) => error.statusCode === 400 && error.message === 'Teacher ID is required!'
    );
});

test('lesson-resource service uses Mongoose queries for CRUD operations', async () => {
    const originals = {
        find: LessonResources.find,
        findOne: LessonResources.findOne,
        create: LessonResources.create,
        findTeacher: Teachers.findOne,
        findSchedule: Schedules.findOne
    };

    try {
        let listQuery;
        LessonResources.find = (query) => ({
            populate: async () => {
                listQuery = query;
                return [{ resource_id: 1 }];
            }
        });

        const resources = await GetLessonResourceData({ role: 'Teacher', teacher_id: 7 });
        assert.deepEqual(listQuery, { teacher_id: 7 });
        assert.deepEqual(resources, [{ resource_id: 1 }]);

        Teachers.findOne = async (query) => ({ teacher_id: query.teacher_id });
        Schedules.findOne = async (query) => ({ schedule_id: query.schedule_id });
        LessonResources.findOne = () => ({
            sort() {
                return this;
            },
            async select() {
                return { resource_id: 4 };
            }
        });

        let createdData;
        LessonResources.create = async (data) => {
            createdData = data;
            return {
                ...data,
                async populate() {
                    return this;
                }
            };
        };

        await CreateLessonResourceData({
            teacher_id: 7,
            schedule_id: 3,
            title: 'Lesson plan',
            resource_type: 'LessonPlan'
        }, { role: 'Admin' });

        assert.equal(createdData.resource_id, 5);
        assert.equal(createdData.teacher_id, 7);
        assert.equal(createdData.schedule_id, 3);

        await CreateLessonResourceData({
            title: 'Teacher lesson plan',
            resource_type: 'LessonPlan'
        }, { role: 'Teacher', teacher_id: 7 });

        assert.equal(createdData.teacher_id, 7);

        let saved = false;
        let deleted = false;
        const document = {
            resource_id: 5,
            teacher_id: 7,
            title: 'Old title',
            async save() {
                saved = true;
            },
            async populate() {
                return this;
            },
            async deleteOne() {
                deleted = true;
            }
        };

        LessonResources.findOne = async () => document;
        await UpdateLessonResourceData(5, { title: 'New title' }, { role: 'Teacher', teacher_id: 7 });
        assert.equal(document.title, 'New title');
        assert.equal(saved, true);

        await DeleteLessonResourceData(5, { role: 'Teacher', teacher_id: 7 });
        assert.equal(deleted, true);
    } finally {
        LessonResources.find = originals.find;
        LessonResources.findOne = originals.findOne;
        LessonResources.create = originals.create;
        Teachers.findOne = originals.findTeacher;
        Schedules.findOne = originals.findSchedule;
    }
});
