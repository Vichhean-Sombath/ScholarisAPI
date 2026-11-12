const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const optionalTrimmedString = (message) => z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    z.string().trim().min(1, message).optional()
);

const requiredScheduleId = z.preprocess(
    (value) => {
        if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
            return undefined;
        }
        return typeof value === 'string' && /^\d+$/.test(value.trim()) ? Number(value) : value;
    },
    z.number({ error: 'Schedule ID is required.' }).int().positive('Schedule ID must be a positive integer.')
);

const resourceUrl = z.string({ error: 'Resource URL is required.' })
    .trim()
    .min(1, 'Resource URL is required.')
    .superRefine((value, context) => {
        if (!value) return;

        let parsedUrl;
        try {
            parsedUrl = new URL(value);
        } catch {
            context.addIssue({ code: 'custom', message: 'Resource URL format is invalid.' });
            return;
        }

        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            context.addIssue({ code: 'custom', message: 'Resource URL must use http:// or https://.' });
        }
    });

const createLessonResourceSchema = z.strictObject({
    schedule_id: requiredScheduleId,
    // Teachers are identified from their access token. Admins still provide this
    // field, and the service enforces that requirement for admin requests.
    teacher_id: z.number().int().positive('Teacher ID must be a positive integer!').optional(),
    title: z.string().trim().min(1, 'Title required!').max(150, 'Title must not exceed 150 characters.'),
    description: optionalTrimmedString('Description must be a non-empty string.'),
    resource_type: z.enum(
        ['LessonPlan', 'Homework', 'Syllabus', 'Other'],
        'Resource type must be LessonPlan, Homework, Syllabus, or Other.'
    ),
    file_url: resourceUrl,
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
