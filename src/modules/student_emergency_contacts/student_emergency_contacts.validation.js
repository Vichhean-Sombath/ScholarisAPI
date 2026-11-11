const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createEmergencyContactSchema = z.strictObject({
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    contact_name: z.string().trim().min(1, 'Contact name required!'),
    relationship: z.string().trim().min(1, 'Relationship must be a non-empty string.').optional(),
    phone_number: z.string().regex(/^\d{9,10}$/, 'Phone number must be 9-10 digits.'),
    email: z.email('Email must be a valid email address.').optional()
});

const updateEmergencyContactSchema = createEmergencyContactSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateEmergencyContact = createValidator(createEmergencyContactSchema);
const ValidationUpdateEmergencyContact = createValidator(updateEmergencyContactSchema);

module.exports = {
    createEmergencyContactSchema,
    updateEmergencyContactSchema,
    ValidationCreateEmergencyContact,
    ValidationUpdateEmergencyContact
};
