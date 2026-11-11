const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createGradeSchema = z.strictObject({
    assessment_id: z.number().int().positive('Assessment ID must be a positive integer!'),
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    score: z.number().nonnegative('Score must be 0 or greater!'),
    entered_by: z.number().int().positive('Entered by must be a positive integer!').optional(),
    is_published: z.boolean('Is published must be a boolean.').optional()
});

const updateGradeSchema = createGradeSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateGrade = createValidator(createGradeSchema);
const ValidationUpdateGrade = createValidator(updateGradeSchema);

module.exports = {
    createGradeSchema,
    updateGradeSchema,
    ValidationCreateGrade,
    ValidationUpdateGrade
};
