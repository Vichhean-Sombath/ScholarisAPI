const { GetCertificateData, SelectCertificateData, CreateCertificateData, DeleteCertificateData } = require('./certificates.service');
const { ValidationCreateCertificate } = require('./certificates.validation');

const GetCertificate = async (req, res) => {
    try {
        const getCertificate = await GetCertificateData();

        res.status(200).json({
            message: 'Certificate retrieved successfully!',
            data: getCertificate
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectCertificate = async (req, res) => {
    try {
        const getCertificate = await SelectCertificateData(req.params.search);

        res.status(200).json({
            message: 'Certificate retrieved successfully!',
            data: getCertificate
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
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

        const createCertificate = await CreateCertificateData(req.body);

        res.status(201).json({
            message: 'Certificate created successfully!',
            data: createCertificate
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteCertificate = async (req, res) => {
    try {
        const deleteCertificate = await DeleteCertificateData(req.params.id);

        res.status(200).json({
            message: 'Certificate deleted successfully!'
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

module.exports = {
    GetCertificate,
    SelectCertificate,
    CreateCertificate,
    DeleteCertificate
}