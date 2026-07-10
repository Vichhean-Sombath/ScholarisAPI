const {
    GetEmergencyContactData,
    SelectedEmergencyContactData,
    CreateEmergencyContactData,
    UpdateEmergencyContactData,
    DeleteEmergencyContactData
} = require('./student_emergency_contacts.service');
const { ValidationCreateEmergencyContact, ValidationUpdateEmergencyContact } = require('./student_emergency_contacts.validation');

const GetEmergencyContact = async (req, res) => {
    try {
        const contactData = await GetEmergencyContactData();

        res.status(200).json({
            message: 'Emergency contacts retrieved successfully!',
            data: contactData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const SelectEmergencyContact = async (req, res) => {
    try {
        const contactData = await SelectedEmergencyContactData(req.params.id);

        res.status(200).json({
            message: 'Emergency contact retrieved successfully!',
            data: contactData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const CreateEmergencyContact = async (req, res) => {
    try {
        const validation = ValidationCreateEmergencyContact(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const contactData = await CreateEmergencyContactData(req.body);

        res.status(201).json({
            message: 'Emergency contact created successfully!',
            data: contactData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const UpdateEmergencyContact = async (req, res) => {
    try {
        const validation = ValidationUpdateEmergencyContact(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const contactData = await UpdateEmergencyContactData(req.params.id, req.body);

        res.status(200).json({
            message: 'Emergency contact updated successfully!',
            data: contactData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

const DeleteEmergencyContact = async (req, res) => {
    try {
        await DeleteEmergencyContactData(req.params.id);

        res.status(200).json({
            message: 'Emergency contact deleted successfully!'
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
};

module.exports = {
    GetEmergencyContact,
    SelectEmergencyContact,
    CreateEmergencyContact,
    UpdateEmergencyContact,
    DeleteEmergencyContact
};
