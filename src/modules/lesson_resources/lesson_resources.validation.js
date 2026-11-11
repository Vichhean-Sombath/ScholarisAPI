const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createLessonResourceSchema = z.strictObject({
    schedule_id: z.number().int().positive('Schedule ID must be a positive integer.').nullable().optional(),
    teacher_id: z.number().int().positive('Teacher ID must be a positive integer!'),
    title: z.string().trim().min(1, 'Title required!').max(150, 'Title must not exceed 150 characters.'),
    description: z.string().trim().min(1, 'Description must be a non-empty string.').optional(),
    resource_type: z.enum(
        ['LessonPlan', 'Homework', 'Syllabus', 'Other'],
        'Resource type must be LessonPlan, Homework, Syllabus, or Other.'
    ),
    file_url: z.string().trim().min(1, 'File URL must be a non-empty string.').optional(),
    upload_date: z.iso.date('Upload date must be a valid YYYY-MM-DD date.').optional()
});

const updateLessonResourceSchema = createLessonResourceSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateLessonResource = createValidator(createLessonResourceSchema);
const ValidationUpdateLessonResource = createValidator(updateLessonResourceSchema);

module.exports = {
    createLessonResourceSchema,
    updateLessonResourceSchema,
    ValidationCreateLessonResource,
    ValidationUpdateLessonResource
};
