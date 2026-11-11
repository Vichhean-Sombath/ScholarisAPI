const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createInvoiceSchema = z.strictObject({
    invoice_number: z.string()
        .trim()
        .min(1, 'Invoice number required and must be a non-empty string.')
        .max(30, 'Invoice number must not exceed 30 characters.'),
    student_id: z.number().int().positive('Student ID must be a positive integer.'),
    fee_id: z.number().int().positive('Fee ID must be a positive integer.'),
    semester_id: z.number().int().positive('Semester ID must be a positive integer.'),
    issue_date: z.iso.date('Issue date must be a valid YYYY-MM-DD date.'),
    due_date: z.iso.date('Due date must be a valid YYYY-MM-DD date.'),
    total_amount: z.number().nonnegative('Total amount must be a non-negative number.'),
    amount_paid: z.number().nonnegative('Amount paid must be a non-negative number.').optional(),
    status: z.enum(
        ['Unpaid', 'Partial', 'Paid', 'Overdue'],
        'Status must be Unpaid, Partial, Paid, or Overdue.'
    ).optional()
}).superRefine((data, context) => {
    if (data.issue_date > data.due_date) {
        context.addIssue({
            code: 'custom',
            path: ['due_date'],
            message: 'Due date must be on or after issue date.'
        });
    }

    if (data.amount_paid !== undefined && data.amount_paid > data.total_amount) {
        context.addIssue({
            code: 'custom',
            path: ['amount_paid'],
            message: 'Amount paid cannot exceed total amount.'
        });
    }
});

const updateInvoiceSchema = z.strictObject({
    invoice_number: z.string().trim().min(1).max(30).optional(),
    student_id: z.number().int().positive().optional(),
    fee_id: z.number().int().positive().optional(),
    semester_id: z.number().int().positive().optional(),
    issue_date: z.iso.date().optional(),
    due_date: z.iso.date().optional(),
    total_amount: z.number().nonnegative().optional(),
    amount_paid: z.number().nonnegative().optional(),
    status: z.enum(['Unpaid', 'Partial', 'Paid', 'Overdue']).optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
).superRefine((data, context) => {
    if (data.issue_date && data.due_date && data.issue_date > data.due_date) {
        context.addIssue({ code: 'custom', path: ['due_date'], message: 'Due date must be on or after issue date.' });
    }

    if (data.total_amount !== undefined && data.amount_paid !== undefined && data.amount_paid > data.total_amount) {
        context.addIssue({ code: 'custom', path: ['amount_paid'], message: 'Amount paid cannot exceed total amount.' });
    }
});

const ValidationCreateInvoice = createValidator(createInvoiceSchema);
const ValidationUpdateInvoice = createValidator(updateInvoiceSchema);

module.exports = {
    createInvoiceSchema,
    updateInvoiceSchema,
    ValidationCreateInvoice,
    ValidationUpdateInvoice
};
