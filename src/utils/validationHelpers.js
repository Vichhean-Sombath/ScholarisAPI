const { Op } = require('sequelize');
const Users = require('../models/users.model');
const Teachers = require('../models/teachers.model');
const Students = require('../models/students.model');

const isEmpty = (value) => value === undefined || value === null || value.toString().trim() === '';

const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneFormat = /^\d{9,10}$/;

const todayString = () => new Date().toISOString().slice(0, 10);

const calculateAge = (dob) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age;
};

const validateEmail = (email, errors) => {
    if (isEmpty(email)) {
        errors.push('Email required!');
    } else if (!emailFormat.test(email)) {
        errors.push('Invalid email format!');
    } else if (email.length > 100) {
        errors.push('Email must not exceed 100 characters!');
    }
};

const validateUsername = (username, errors) => {
    if (isEmpty(username)) {
        errors.push('Username required!');
    } else if (username.length > 50) {
        errors.push('Username must not exceed 50 characters!');
    }
};

const validatePassword = (password, errors, fieldName = 'Password') => {
    if (isEmpty(password)) {
        errors.push(`${fieldName} required!`);
    } else if (password.length < 8) {
        errors.push(`${fieldName} must be at least 8 characters!`);
    } else if (!/[A-Z]/.test(password)) {
        errors.push(`${fieldName} must contain at least one capital letter!`);
    } else if (!/[a-z]/.test(password)) {
        errors.push(`${fieldName} must contain at least one lowercase letter!`);
    } else if (!/\d/.test(password)) {
        errors.push(`${fieldName} must contain at least one number!`);
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push(`${fieldName} must contain at least one special character!`);
    }
};

const validateDob = (dob, minAge, errors, label) => {
    if (isEmpty(dob)) {
        errors.push(`${label} date of birth required!`);
        return;
    }
    if (isNaN(Date.parse(dob))) {
        errors.push(`Invalid ${label.toLowerCase()} date of birth!`);
        return;
    }
    const age = calculateAge(dob);
    if (age < minAge) {
        errors.push(`${label} must be at least ${minAge} years old.`);
    }
};

const validatePhone = (phone, errors, label = 'Phone number') => {
    if (isEmpty(phone)) {
        errors.push(`${label} required!`);
        return;
    }
    const digits = phone.toString().replace(/\D/g, '');
    if (!/^\d{9,10}$/.test(digits)) {
        errors.push(`${label} must be 9-10 digits.`);
    }
};

const checkDuplicateEmail = async (email, excludeUserId = null) => {
    const where = { email };
    if (excludeUserId) {
        where.user_id = { [Op.ne]: excludeUserId };
    }
    return await Users.findOne({ where });
};

const checkDuplicatePhone = async (phone, excludeUserId = null) => {
    const where = { contact_number: phone };
    if (excludeUserId) {
        where.user_id = { [Op.ne]: excludeUserId };
    }
    const teacher = await Teachers.findOne({ where });
    if (teacher) return { type: 'teacher', record: teacher };
    const student = await Students.findOne({ where });
    if (student) return { type: 'student', record: student };
    return null;
};

module.exports = {
    isEmpty,
    emailFormat,
    phoneFormat,
    todayString,
    calculateAge,
    validateEmail,
    validateUsername,
    validatePassword,
    validateDob,
    validatePhone,
    checkDuplicateEmail,
    checkDuplicatePhone
};
