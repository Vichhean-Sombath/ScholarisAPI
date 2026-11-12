const test = require('node:test');
const assert = require('node:assert/strict');

const AcademicYears = require('../src/models/academic_years.model');
const {
    CreateAcademicYearData,
    UpdateAcademicYearData
} = require('../src/modules/academic_years/academic_years.service');

test('academic-year service rejects short durations on create and partial update', async () => {
    const originalFindOne = AcademicYears.findOne;

    try {
        AcademicYears.findOne = async () => null;

        await assert.rejects(
            CreateAcademicYearData({
                year_name: '2026',
                start_date: '2026-11-09',
                end_date: '2026-11-18'
            }),
            (error) => error.statusCode === 400
                && error.message === 'Academic year must be at least 10 months long!'
        );

        AcademicYears.findOne = async () => ({
            academic_year_id: 1,
            year_name: '2026-2027',
            start_date: new Date('2026-09-01T00:00:00.000Z'),
            end_date: new Date('2027-06-30T00:00:00.000Z'),
            save: async () => {}
        });

        await assert.rejects(
            UpdateAcademicYearData(1, { end_date: '2026-11-18' }),
            (error) => error.statusCode === 400
                && error.message === 'Academic year must be at least 10 months long!'
        );
    } finally {
        AcademicYears.findOne = originalFindOne;
    }
});
