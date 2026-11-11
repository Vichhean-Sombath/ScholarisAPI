const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const createCertificateSchema = z.strictObject({
    student_id: z.number().int().positive('Student ID must be a positive integer!'),
    certificate_type: z.enum(
        ['Completion', 'Transcript', 'Recommendation'],
        'Certificate type must be Completion, Transcript, or Recommendation!'
    ),
    template_used: z.string().trim().min(1, 'Template used must be a non-empty string.').optional(),
    issue_date: z.iso.date('Issue date must be a valid date in YYYY-MM-DD format!'),
    generated_file_url: z.url('Generated file URL format is invalid!').refine(
        (value) => value.startsWith('http://') || value.startsWith('https://'),
        'Generated file URL must use http:// or https://!'
    ).optional(),
    issued_by: z.number().int().positive('Issued by must be a positive user ID!')
});

const ValidationCreateCertificate = createValidator(createCertificateSchema);

module.exports = {
    createCertificateSchema,
    ValidationCreateCertificate
};
