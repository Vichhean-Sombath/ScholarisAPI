const {
    GetClassEnrollmentData,
    SelectedClassEnrollmentData,
    CreateClassEnrollmentData,
    UpdateClassEnrollmentData,
    DeleteClassEnrollmentData
} = require('./class_enrollments.service');
const { ValidationCreateClassEnrollment, ValidationUpdateClassEnrollment } = require('./class_enrollments.validation');

const GetClassEnrollment = async (req, res) => {
    try {
        const enrollmentData = await GetClassEnrollmentData();

        res.status(200).json({
            message: 'Class enrollments retrieved successfully!',
            data: enrollmentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const SelectClassEnrollment = async (req, res) => {
    try {
        const enrollmentData = await SelectedClassEnrollmentData(req.params.id);

        res.status(200).json({
            message: 'Class enrollment retrieved successfully!',
            data: enrollmentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const CreateClassEnrollment = async (req, res) => {
    try {
        const validation = ValidationCreateClassEnrollment(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const enrollmentData = await CreateClassEnrollmentData(req.body);

        res.status(201).json({
            message: 'Class enrollment created successfully!',
            data: enrollmentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const UpdateClassEnrollment = async (req, res) => {
    try {
        const validation = ValidationUpdateClassEnrollment(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const enrollmentData = await UpdateClassEnrollmentData(req.params.id, req.body);

        res.status(200).json({
            message: 'Class enrollment updated successfully!',
            data: enrollmentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const DeleteClassEnrollment = async (req, res) => {
    try {
        await DeleteClassEnrollmentData(req.params.id);

        res.status(200).json({
            message: 'Class enrollment deleted successfully!'
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

module.exports = {
    GetClassEnrollment,
    SelectClassEnrollment,
    CreateClassEnrollment,
    UpdateClassEnrollment,
    DeleteClassEnrollment
};
