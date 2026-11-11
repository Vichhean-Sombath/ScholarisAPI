const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const timeSchema = z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    'Time must use HH:mm 24-hour format.'
);

const createTimeSlotSchema = z.strictObject({
    day_of_week: z.enum(
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'Day of week must be Mon, Tue, Wed, Thu, Fri, Sat, or Sun.'
    ),
    start_time: timeSchema,
    end_time: timeSchema
}).refine(
    (data) => data.start_time < data.end_time,
    { path: ['end_time'], message: 'End time must be after start time.' }
);

const updateTimeSlotSchema = z.strictObject({
    day_of_week: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).optional(),
    start_time: timeSchema.optional(),
    end_time: timeSchema.optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
).refine(
    (data) => !data.start_time || !data.end_time || data.start_time < data.end_time,
    { path: ['end_time'], message: 'End time must be after start time.' }
);

const ValidationCreateTimeSlot = createValidator(createTimeSlotSchema);
const ValidationUpdateTimeSlot = createValidator(updateTimeSlotSchema);

module.exports = {
    createTimeSlotSchema,
    updateTimeSlotSchema,
    ValidationCreateTimeSlot,
    ValidationUpdateTimeSlot
};
