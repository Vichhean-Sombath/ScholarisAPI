const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createFinalGradeSchema = z.strictObject({
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    subject_id: z.number().int().positive('Subject ID must be a positive integer!'),
    class_id: z.number().int().positive('Class ID must be a positive integer!'),
    semester_id: z.number().int().positive('Semester ID must be a positive integer!'),
    final_score: z.number().min(0).max(100, 'Final score must be between 0 and 100!'),
    letter_grade: z.string().trim().min(1, 'Letter grade must be a non-empty string.').optional(),
    gpa_points: z.number().min(0).max(4, 'GPA points must be between 0 and 4.').optional()
});

const updateFinalGradeSchema = createFinalGradeSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateFinalGrade = createValidator(createFinalGradeSchema);
const ValidationUpdateFinalGrade = createValidator(updateFinalGradeSchema);

module.exports = {
    createFinalGradeSchema,
    updateFinalGradeSchema,
    ValidationCreateFinalGrade,
    ValidationUpdateFinalGrade
};
