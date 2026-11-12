const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const THREE_MONTHS = 3;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const toUtcDateOnly = (value) => {
    const date = new Date(value);

    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ));
};

const hasMinimumSemesterDuration = (startDate, endDate) => {
    const start = toUtcDateOnly(startDate);
    const end = toUtcDateOnly(endDate);
    const minimumEndDate = new Date(Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth() + THREE_MONTHS,
        start.getUTCDate()
    ) - ONE_DAY_IN_MS);

    return end >= minimumEndDate;
};

const createSemesterSchema = z.strictObject({
    academic_year_id: z.number().int().positive('Academic year ID must be a positive integer!'),
    semester_name: z.string().trim().min(1, 'Semester name required!'),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!'),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!')
}).refine(
    (data) => hasMinimumSemesterDuration(data.start_date, data.end_date),
    { path: ['end_date'], message: 'Semester must be at least 3 months long.' }
);

const updateSemesterSchema = z.strictObject({
    academic_year_id: z.number().int().positive('Academic year ID must be a positive integer!').optional(),
    semester_name: z.string().trim().min(1, 'Semester name must be a non-empty string.').optional(),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!').optional(),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!').optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
).refine(
    (data) => (
        !data.start_date
        || !data.end_date
        || hasMinimumSemesterDuration(data.start_date, data.end_date)
    ),
    { path: ['end_date'], message: 'Semester must be at least 3 months long.' }
);

const ValidationCreateSemester = createValidator(createSemesterSchema);
const ValidationUpdateSemester = createValidator(updateSemesterSchema);

module.exports = {
    createSemesterSchema,
    updateSemesterSchema,
    hasMinimumSemesterDuration,
    ValidationCreateSemester,
    ValidationUpdateSemester
};
