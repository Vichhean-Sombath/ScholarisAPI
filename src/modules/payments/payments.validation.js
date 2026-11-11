const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createPaymentSchema = z.strictObject({
    invoice_id: z.number().int().positive('Invoice ID must be a positive integer.'),
    payment_date: z.iso.date('Payment date must be a valid YYYY-MM-DD date.'),
    amount: z.number().positive('Amount must be a positive number.'),
    payment_method: z.enum(['stripe', 'bakongkhqr'], 'Payment method must be stripe or bakongkhqr.'),
    receipt_url: z.string().trim().min(1, 'Receipt URL must be a non-empty string.').optional(),
    transaction_reference: z.string().trim().min(1, 'Transaction reference must be a non-empty string.').optional(),
    recorded_by: z.number().int().positive('Recorded by must be a positive integer.'),
    notes: z.string().trim().min(1, 'Notes must be a non-empty string.').optional()
});

const updatePaymentSchema = createPaymentSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const ValidationCreatePayment = createValidator(createPaymentSchema);
const ValidationUpdatePayment = createValidator(updatePaymentSchema);

module.exports = {
    createPaymentSchema,
    updatePaymentSchema,
    ValidationCreatePayment,
    ValidationUpdatePayment
};
