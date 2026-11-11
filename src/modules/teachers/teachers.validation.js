const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const updateTeacherSchema = z.strictObject({
    first_name: z.string().trim().min(1, 'First name must be a non-empty string.').optional(),
    last_name: z.string().trim().min(1, 'Last name must be a non-empty string.').optional(),
    gender: z.enum(['Male', 'Female', 'Other'], 'Gender must be Male, Female, or Other.').optional(),
    dob: z.iso.date('Date of birth must be a valid YYYY-MM-DD date.').optional(),
    photo_url: z.string().trim().min(1, 'Photo URL must be a non-empty string.').optional(),
    contact_number: z.string().regex(/^\d{9,10}$/, 'Phone number must be 9-10 digits.').optional(),
    specialization: z.string().trim().min(1, 'Specialization must be a non-empty string.').optional(),
    bio: z.string().trim().min(1, 'Bio must be a non-empty string.').optional(),
    hire_date: z.iso.date('Hire date must be a valid YYYY-MM-DD date.').optional(),
    status: z.enum(['Active', 'Inactive'], 'Status must be Active or Inactive.').optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationUpdateTeacher = createValidator(updateTeacherSchema);

module.exports = {
    updateTeacherSchema,
    ValidationUpdateTeacher
};
