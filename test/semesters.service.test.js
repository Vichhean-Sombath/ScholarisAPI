const test = require('node:test');
const assert = require('node:assert/strict');

const Semesters = require('../src/models/semesters.model');
const AcademicYears = require('../src/models/academic_years.model');
const {
    CreateSemesterData,
    UpdateSemesterData
} = require('../src/modules/semesters/semesters.service');

test('semester service rejects short durations on create and partial update', async () => {
    const originalSemesterFindOne = Semesters.findOne;
    const originalAcademicYearFindOne = AcademicYears.findOne;

    try {
        AcademicYears.findOne = async () => ({
            academic_year_id: 1,
            start_date: new Date('2026-09-01T00:00:00.000Z'),
            end_date: new Date('2027-06-30T00:00:00.000Z')
        });

        await assert.rejects(
            CreateSemesterData({
                academic_year_id: 1,
                semester_name: 'Semester 1',
                start_date: '2026-09-01',
                end_date: '2026-11-29'
            }),
            (error) => error.statusCode === 400
                && error.message === 'Semester must be at least 3 months long!'
        );

        Semesters.findOne = async () => ({
            semester_id: 1,
            academic_year_id: 1,
            semester_name: 'Semester 1',
            start_date: new Date('2026-09-01T00:00:00.000Z'),
            end_date: new Date('2027-01-31T00:00:00.000Z'),
            save: async () => {}
        });

        await assert.rejects(
            UpdateSemesterData(1, { end_date: '2026-11-29' }),
            (error) => error.statusCode === 400
                && error.message === 'Semester must be at least 3 months long!'
        );
    } finally {
        Semesters.findOne = originalSemesterFindOne;
        AcademicYears.findOne = originalAcademicYearFindOne;
    }
});
