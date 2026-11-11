const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createSemesterSchema = z.strictObject({
    academic_year_id: z.number().int().positive('Academic year ID must be a positive integer!'),
    semester_name: z.string().trim().min(1, 'Semester name required!'),
    start_date: z.iso.date('Start date must be a valid YYYY-MM-DD date!'),
    end_date: z.iso.date('End date must be a valid YYYY-MM-DD date!')
}).refine(
    (data) => data.start_date <= data.end_date,
    { path: ['end_date'], message: 'End date must be on or after start date.' }
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
    (data) => !data.start_date || !data.end_date || data.start_date <= data.end_date,
    { path: ['end_date'], message: 'End date must be on or after start date.' }
);

const ValidationCreateSemester = createValidator(createSemesterSchema);
const ValidationUpdateSemester = createValidator(updateSemesterSchema);

module.exports = {
    createSemesterSchema,
    updateSemesterSchema,
    ValidationCreateSemester,
    ValidationUpdateSemester
};
