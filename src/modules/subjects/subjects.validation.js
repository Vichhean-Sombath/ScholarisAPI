const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createSubjectSchema = z.strictObject({
    subject_code: z.string().trim().min(1, 'Subject code required!'),
    subject_name: z.string().trim().min(1, 'Subject name required!'),
    description: z.string().trim().min(1, 'Description must be a non-empty string.').optional(),
    prerequisite_subject_id: z.number()
        .int()
        .positive('Prerequisite subject ID must be a positive integer.')
        .nullable()
        .optional()
});

const updateSubjectSchema = createSubjectSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateSubject = createValidator(createSubjectSchema);
const ValidationUpdateSubject = createValidator(updateSubjectSchema);

module.exports = {
    createSubjectSchema,
    updateSubjectSchema,
    ValidationCreateSubject,
    ValidationUpdateSubject
};
