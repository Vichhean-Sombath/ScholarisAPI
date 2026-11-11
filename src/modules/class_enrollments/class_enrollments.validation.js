const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createClassEnrollmentSchema = z.strictObject({
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    class_id: z.number().int().positive('Class ID must be a positive integer!'),
    enrollment_date: z.iso.date('Enrollment date must be a valid YYYY-MM-DD date!'),
    status: z.enum(
        ['Active', 'Transferred', 'Withdrawn'],
        'Status must be Active, Transferred, or Withdrawn.'
    ).optional()
});

const updateClassEnrollmentSchema = createClassEnrollmentSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateClassEnrollment = createValidator(createClassEnrollmentSchema);
const ValidationUpdateClassEnrollment = createValidator(updateClassEnrollmentSchema);

module.exports = {
    createClassEnrollmentSchema,
    updateClassEnrollmentSchema,
    ValidationCreateClassEnrollment,
    ValidationUpdateClassEnrollment
};
