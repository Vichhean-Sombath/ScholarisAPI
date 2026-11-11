const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createAssessmentSchema = z.strictObject({
    schedule_id: z.number().int().positive('Schedule ID must be a positive integer!'),
    criteria_id: z.number().int().positive('Criteria ID must be a positive integer!'),
    assessment_name: z.string().trim().min(1, 'Assessment name required!'),
    max_score: z.number().positive('Max score must be greater than 0!'),
    assessment_date: z.iso.date('Assessment date must be a valid YYYY-MM-DD date.').optional()
});

const updateAssessmentSchema = createAssessmentSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateAssessment = createValidator(createAssessmentSchema);
const ValidationUpdateAssessment = createValidator(updateAssessmentSchema);

module.exports = {
    createAssessmentSchema,
    updateAssessmentSchema,
    ValidationCreateAssessment,
    ValidationUpdateAssessment
};
