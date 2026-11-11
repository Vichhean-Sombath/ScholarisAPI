const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createAttendanceRecordSchema = z.strictObject({
    schedule_id: z.number().int().positive('Schedule ID must be a positive integer!'),
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    attendance_date: z.iso.date('Attendance date must be a valid YYYY-MM-DD date!'),
    status: z.enum(
        ['Present', 'Absent', 'Late', 'Excused'],
        'Status must be Present, Absent, Late, or Excused!'
    ),
    marked_by: z.number().int().positive('Marked by must be a positive teacher ID.').optional()
});

const updateAttendanceRecordSchema = createAttendanceRecordSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreateAttendanceRecord = createValidator(createAttendanceRecordSchema);
const ValidationUpdateAttendanceRecord = createValidator(updateAttendanceRecordSchema);

module.exports = {
    createAttendanceRecordSchema,
    updateAttendanceRecordSchema,
    ValidationCreateAttendanceRecord,
    ValidationUpdateAttendanceRecord
};
