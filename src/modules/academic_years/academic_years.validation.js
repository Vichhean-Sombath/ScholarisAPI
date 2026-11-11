const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createAcademicYearSchema = z.strictObject({
    year_name: z.string().trim().min(1, 'Year name required!'),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!'),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!'),
    status: z.enum(['Active', 'Closed'], 'Status must be Active or Closed!').optional()
}).refine(
    (data) => data.start_date <= data.end_date,
    { path: ['end_date'], message: 'End date must be on or after start date.' }
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
    (data) => !data.start_date || !data.end_date || data.start_date <= data.end_date,
    { path: ['end_date'], message: 'End date must be on or after start date.' }
);

const ValidationCreateAcademicYear = createValidator(createAcademicYearSchema);
const ValidationUpdateAcademicYear = createValidator(updateAcademicYearSchema);

module.exports = {
    createAcademicYearSchema,
    updateAcademicYearSchema,
    ValidationCreateAcademicYear,
    ValidationUpdateAcademicYear
};
