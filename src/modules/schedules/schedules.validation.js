const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createScheduleSchema = z.strictObject({
    class_id: z.number().int().positive('Class ID must be a positive integer!'),
    subject_id: z.number().int().positive('Subject ID must be a positive integer!'),
    teacher_id: z.number().int().positive('Teacher ID must be a positive integer!'),
    time_slot_id: z.number().int().positive('Time slot ID must be a positive integer!'),
    room_number: z.string().trim().min(1, 'Room number must be a non-empty string.').optional()
});

const updateScheduleSchema = createScheduleSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateSchedule = createValidator(createScheduleSchema);
const ValidationUpdateSchedule = createValidator(updateScheduleSchema);

module.exports = {
    createScheduleSchema,
    updateScheduleSchema,
    ValidationCreateSchedule,
    ValidationUpdateSchedule
};
