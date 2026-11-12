const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const timeSchema = z.string().regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    'Time must use HH:mm 24-hour format.'
);

const MINIMUM_TIME_SLOT_MINUTES = 90;

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
};

const hasMinimumTimeSlotDuration = (startTime, endTime) => (
    timeToMinutes(endTime) - timeToMinutes(startTime) >= MINIMUM_TIME_SLOT_MINUTES
);

const createTimeSlotSchema = z.strictObject({
    day_of_week: z.enum(
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'Day of week must be Mon, Tue, Wed, Thu, Fri, Sat, or Sun.'
    ),
    start_time: timeSchema,
    end_time: timeSchema
}).refine(
    (data) => hasMinimumTimeSlotDuration(data.start_time, data.end_time),
    { path: ['end_time'], message: 'Time slot must be at least 1 hour 30 minutes long.' }
);

const updateTimeSlotSchema = z.strictObject({
    day_of_week: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).optional(),
    start_time: timeSchema.optional(),
    end_time: timeSchema.optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
).refine(
    (data) => (
        !data.start_time
        || !data.end_time
        || hasMinimumTimeSlotDuration(data.start_time, data.end_time)
    ),
    { path: ['end_time'], message: 'Time slot must be at least 1 hour 30 minutes long.' }
);

const ValidationCreateTimeSlot = createValidator(createTimeSlotSchema);
const ValidationUpdateTimeSlot = createValidator(updateTimeSlotSchema);

module.exports = {
    createTimeSlotSchema,
    updateTimeSlotSchema,
    hasMinimumTimeSlotDuration,
    ValidationCreateTimeSlot,
    ValidationUpdateTimeSlot
};
