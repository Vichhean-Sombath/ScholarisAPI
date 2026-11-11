const { z } = require('zod');
const { createValidator } = require('../../utils/zodValidation');

const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
};

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters!')
    .regex(/[A-Z]/, 'Password must contain at least one capital letter!')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter!')
    .regex(/\d/, 'Password must contain at least one number!')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character!');

const createUserSchema = z.strictObject({
    username: z.string().trim().min(1, 'Username required!').max(50, 'Username must not exceed 50 characters!'),
    email: z.email('Invalid email format!').max(100, 'Email must not exceed 100 characters!'),
    password: passwordSchema,
    role: z.enum(['Admin', 'Teacher', 'Student'], 'Role must be Admin, Teacher, or Student!'),
    first_name: z.string().trim().min(1, 'First name must be a non-empty string.').optional(),
    last_name: z.string().trim().min(1, 'Last name must be a non-empty string.').optional(),
    gender: z.enum(['Male', 'Female', 'Other'], 'Gender must be Male, Female, or Other.').optional(),
    dob: z.iso.date('Date of birth must be a valid YYYY-MM-DD date.').optional(),
    contact_number: z.string().regex(/^\d{9,10}$/, 'Phone number must be 9-10 digits.').optional(),
    specialization: z.string().trim().min(1, 'Specialization must be a non-empty string.').optional(),
    bio: z.string().trim().min(1, 'Bio must be a non-empty string.').optional(),
    photo_url: z.string().trim().min(1, 'Photo URL must be a non-empty string.').optional(),
    address: z.string().trim().min(1, 'Address must be a non-empty string.').optional(),
    hire_date: z.iso.date('Hire date must be a valid YYYY-MM-DD date.').optional(),
    enrollment_date: z.iso.date('Enrollment date must be a valid YYYY-MM-DD date.').optional()
}).superRefine((data, context) => {
    if (data.role === 'Admin') return;

    for (const field of ['first_name', 'last_name', 'dob', 'contact_number']) {
        if (data[field] === undefined) {
            context.addIssue({
                code: 'custom',
                path: [field],
                message: `${data.role} ${field.replace('_', ' ')} required!`
            });
        }
    }

    if (data.role === 'Teacher' && data.specialization === undefined) {
        context.addIssue({ code: 'custom', path: ['specialization'], message: 'Teacher specialization required!' });
    }

    if (data.dob) {
        const minimumAge = data.role === 'Teacher' ? 25 : 16;
        if (calculateAge(data.dob) < minimumAge) {
            context.addIssue({
                code: 'custom',
                path: ['dob'],
                message: `${data.role} must be at least ${minimumAge} years old.`
            });
        }
    }
});

const updateUserSchema = z.strictObject({
    username: z.string().trim().min(1).max(50).optional(),
    email: z.email().max(100).optional(),
    password: passwordSchema.optional(),
    role: z.enum(['Admin', 'Teacher', 'Student']).optional(),
    status: z.enum(['Active', 'Inactive']).optional(),
    first_name: z.string().trim().min(1).optional(),
    last_name: z.string().trim().min(1).optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    dob: z.iso.date().optional(),
    contact_number: z.string().regex(/^\d{9,10}$/).optional(),
    specialization: z.string().trim().min(1).optional(),
    bio: z.string().trim().min(1).optional(),
    photo_url: z.string().trim().min(1).optional(),
    address: z.string().trim().min(1).optional(),
    hire_date: z.iso.date().optional(),
    enrollment_date: z.iso.date().optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided.'
);

const changePasswordSchema = z.strictObject({
    currentPassword: z.string().min(1, 'Current password required!'),
    newPassword: passwordSchema
});

const ValidationCreateUser = createValidator(createUserSchema);
const ValidationUpdateUser = createValidator(updateUserSchema);
const ValidationChangePassword = createValidator(changePasswordSchema);

module.exports = {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    ValidationCreateUser,
    ValidationUpdateUser,
    ValidationChangePassword
};
