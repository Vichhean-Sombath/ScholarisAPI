const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createFeeStructureSchema = z.strictObject({
    class_id: z.number().int().positive('Class ID must be a positive integer.').nullable().optional(),
    semester_id: z.number().int().positive('Semester ID must be a positive integer!'),
    fee_name: z.string()
        .trim()
        .min(1, 'Fee name required and must be a non-empty string.')
        .max(100, 'Fee name must not exceed 100 characters.'),
    amount: z.number().nonnegative('Amount must be a non-negative number.'),
    due_date: z.iso.date('Due date must be a valid YYYY-MM-DD date.').optional()
});

const updateFeeStructureSchema = createFeeStructureSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateFeeStructure = createValidator(createFeeStructureSchema);
const ValidationUpdateFeeStructure = createValidator(updateFeeStructureSchema);

module.exports = {
    createFeeStructureSchema,
    updateFeeStructureSchema,
    ValidationCreateFeeStructure,
    ValidationUpdateFeeStructure
};
