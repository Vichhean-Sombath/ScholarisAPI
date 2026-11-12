const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const TEN_MONTHS = 10;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const toUtcDateOnly = (value) => {
    const date = new Date(value);

    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    ));
};

const hasMinimumAcademicYearDuration = (startDate, endDate) => {
    const start = toUtcDateOnly(startDate);
    const end = toUtcDateOnly(endDate);
    const minimumEndDate = new Date(Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth() + TEN_MONTHS,
        start.getUTCDate()
    ) - ONE_DAY_IN_MS);

    return end >= minimumEndDate;
};

const createAcademicYearSchema = z.strictObject({
    year_name: z.string().trim().min(1, 'Year name required!'),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!'),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!'),
    status: z.enum(['Active', 'Closed'], 'Status must be Active or Closed!').optional()
}).refine(
    (data) => hasMinimumAcademicYearDuration(data.start_date, data.end_date),
    { path: ['end_date'], message: 'Academic year must be at least 10 months long.' }
);

const updateAcademicYearSchema = z.strictObject({
    year_name: z.string().trim().min(1, 'Year name must be a non-empty string.').optional(),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!').optional(),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!').optional(),
    status: z.enum(['Active', 'Closed'], 'Status must be Active or Closed!').optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
).refine(
    (data) => (
        !data.start_date
        || !data.end_date
        || hasMinimumAcademicYearDuration(data.start_date, data.end_date)
    ),
    { path: ['end_date'], message: 'Academic year must be at least 10 months long.' }
);

const ValidationCreateAcademicYear = createValidator(createAcademicYearSchema);
const ValidationUpdateAcademicYear = createValidator(updateAcademicYearSchema);

module.exports = {
    createAcademicYearSchema,
    updateAcademicYearSchema,
    hasMinimumAcademicYearDuration,
    ValidationCreateAcademicYear,
    ValidationUpdateAcademicYear
};
