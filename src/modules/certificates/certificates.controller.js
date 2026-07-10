const { GetCertificateData, SelectCertificateData, CreateCertificateData, DeleteCertificateData } = require('./certificates.service');
const { ValidationCreateCertificate } = require('./certificates.validation');

const GetCertificate = async (req, res) => {
    try {
        const certificateData = await GetCertificateData();

        res.status(200).json({
            message: 'Certificate retrieved successfully!',
            data: certificateData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectCertificate = async (req, res) => {
    try {
        const certificateData = await SelectCertificateData(req.params.id);

        res.status(200).json({
            message: 'Certificate retrieved successfully!',
            data: certificateData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const CreateCertificate = async (req, res) => {
    try {
        const validation = ValidationCreateCertificate(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error,
            });
        }

        const certificateData = await CreateCertificateData(req.body);

        res.status(201).json({
            message: 'Certificate created successfully!',
            data: certificateData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeleteCertificate = async (req, res) => {
    try {
        await DeleteCertificateData(req.params.id);

        res.status(200).json({
            message: 'Certificate deleted successfully!'
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetCertificate,
    SelectCertificate,
    CreateCertificate,
    DeleteCertificate
}