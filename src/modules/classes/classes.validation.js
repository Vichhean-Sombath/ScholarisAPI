const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createClassSchema = z.strictObject({
    class_name: z.string().trim().min(1, 'Class name required!'),
    academic_year_id: z.number().int().positive('Academic year ID must be a positive integer!'),
    semester_id: z.number().int().positive('Semester ID must be a positive integer!'),
    room_number: z.string().trim().min(1, 'Room number must be a non-empty string.').optional(),
    max_capacity: z.number().int().positive('Max capacity must be a positive integer.').optional(),
    homeroom_teacher_id: z.number({ error: 'Homeroom teacher required!' })
        .int()
        .positive('Homeroom teacher ID must be a positive integer.')
});

const updateClassSchema = createClassSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateClass = createValidator(createClassSchema);
const ValidationUpdateClass = createValidator(updateClassSchema);

module.exports = {
    createClassSchema,
    updateClassSchema,
    ValidationCreateClass,
    ValidationUpdateClass
};
