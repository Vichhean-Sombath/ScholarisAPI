const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createGradingCriteriaSchema = z.strictObject({
    subject_id: z.number().int().positive('Subject ID must be a positive integer.').nullable().optional(),
    class_id: z.number().int().positive('Class ID must be a positive integer.').nullable().optional(),
    component_name: z.string().trim().min(1, 'Component name required!'),
    weight_percentage: z.number()
        .positive('Weight percentage must be greater than 0!')
        .max(100, 'Weight percentage must be at most 100!'),
    attempt_count: z.number().int().positive('Attempt count must be a positive whole number!')
}).refine(
    (data) => data.subject_id != null || data.class_id != null,
    'Please select at least a subject or a class.'
);

const updateGradingCriteriaSchema = z.strictObject({
    subject_id: z.number().int().positive('Subject ID must be a positive integer.').nullable().optional(),
    class_id: z.number().int().positive('Class ID must be a positive integer.').nullable().optional(),
    component_name: z.string().trim().min(1, 'Component name must be a non-empty string.').optional(),
    weight_percentage: z.number().positive().max(100, 'Weight percentage must be between 0 and 100.').optional(),
    attempt_count: z.number().int().positive('Attempt count must be a positive whole number.').optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateGradingCriteria = createValidator(createGradingCriteriaSchema);
const ValidationUpdateGradingCriteria = createValidator(updateGradingCriteriaSchema);

module.exports = {
    createGradingCriteriaSchema,
    updateGradingCriteriaSchema,
    ValidationCreateGradingCriteria,
    ValidationUpdateGradingCriteria
};
