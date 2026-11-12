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

const loginSchema = z.strictObject({
    email: z.email('Invalid email format!'),
    password: z.string().min(1, 'Password required!')
});

const registerSchema = z.strictObject({
    username: z.string().trim().min(1, 'Username required!').max(50, 'Username must not exceed 50 characters!'),
    email: z.email('Invalid email format!').max(100, 'Email must not exceed 100 characters!'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters!')
        .regex(/[A-Z]/, 'Password must contain at least one capital letter!')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter!')
        .regex(/\d/, 'Password must contain at least one number!')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character!'),
    role: z.enum(['Teacher', 'Student'], 'Role must be Teacher or Student!'),
    first_name: z.string().trim().min(1, 'First name required!'),
    last_name: z.string().trim().min(1, 'Last name required!'),
    gender: z.enum(['Male', 'Female', 'Other'], 'Gender must be Male, Female, or Other!'),
    dob: z.iso.date('Date of birth must be a valid YYYY-MM-DD date!'),
    contact_number: z.string().regex(/^\d{9,10}$/, 'Phone number must be 9-10 digits.'),
    address: z.string().trim().min(1, 'Address must be a non-empty string.').optional(),
    photo_url: z.string().trim().min(1, 'Photo URL must be a non-empty string.').optional(),
    specialization: z.string().trim().min(1, 'Specialization must be a non-empty string.').optional(),
    bio: z.string().trim().min(1, 'Bio must be a non-empty string.').optional(),
    hire_date: z.iso.date('Hire date must be a valid YYYY-MM-DD date.').optional(),
    enrollment_date: z.iso.date('Enrollment date must be a valid YYYY-MM-DD date.').optional()
}).superRefine((data, context) => {
    const roleFields = data.role === 'Teacher'
        ? [
            ['specialization', 'Teacher specialization required!'],
            ['hire_date', 'Teacher hire date required!']
        ]
        : [
            ['address', 'Student address required!'],
            ['enrollment_date', 'Student enrollment date required!']
        ];

    for (const [field, message] of roleFields) {
        if (data[field] === undefined) {
            context.addIssue({ code: 'custom', path: [field], message });
        }
    }

    const minimumAge = data.role === 'Teacher' ? 25 : 16;

    if (calculateAge(data.dob) < minimumAge) {
        context.addIssue({
            code: 'custom',
            path: ['dob'],
            message: `${data.role} must be at least ${minimumAge} years old.`
        });
    }
});

const ValidationLoginUser = createValidator(loginSchema);
const ValidationRegisterUser = createValidator(registerSchema);

module.exports = {
    loginSchema,
    registerSchema,
    ValidationLoginUser,
    ValidationRegisterUser
};
