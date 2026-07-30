const {
    getStudentSummary,
    getStudentClasses,
    getStudentSchedule,
    getStudentGrades,
    getStudentAttendance,
    getStudentInvoices,
    getStudentCertificates,
    getStudentResources,
    getStudentProfile,
    checkInAttendance,
} = require('./student_portal.service');

const GetStudentSummary = async (req, res, next) => {
    try {
        const data = await getStudentSummary(req.user.student_id);
        res.status(200).json({
            message: 'Student summary retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentClasses = async (req, res, next) => {
    try {
        const data = await getStudentClasses(req.user.student_id);
        res.status(200).json({
            message: 'Student classes retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentSchedule = async (req, res, next) => {
    try {
        const data = await getStudentSchedule(req.user.student_id);
        res.status(200).json({
            message: 'Student schedule retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentGrades = async (req, res, next) => {
    try {
        const data = await getStudentGrades(req.user.student_id);
        res.status(200).json({
            message: 'Student grades retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentAttendance = async (req, res, next) => {
    try {
        const data = await getStudentAttendance(req.user.student_id);
        res.status(200).json({
            message: 'Student attendance retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentInvoices = async (req, res, next) => {
    try {
        const data = await getStudentInvoices(req.user.student_id);
        res.status(200).json({
            message: 'Student invoices retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentCertificates = async (req, res, next) => {
    try {
        const data = await getStudentCertificates(req.user.student_id);
        res.status(200).json({
            message: 'Student certificates retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentResources = async (req, res, next) => {
    try {
        const data = await getStudentResources(req.user.student_id);
        res.status(200).json({
            message: 'Student resources retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const GetStudentProfile = async (req, res, next) => {
    try {
        const data = await getStudentProfile(req.user.student_id);
        res.status(200).json({
            message: 'Student profile retrieved successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

const CheckInAttendance = async (req, res, next) => {
    try {
        const data = await checkInAttendance(req.user.student_id, req.body);
        res.status(201).json({
            message: 'Attendance checked in successfully!',
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    GetStudentSummary,
    GetStudentClasses,
    GetStudentSchedule,
    GetStudentGrades,
    GetStudentAttendance,
    GetStudentInvoices,
    GetStudentCertificates,
    GetStudentResources,
    GetStudentProfile,
    CheckInAttendance,
};
