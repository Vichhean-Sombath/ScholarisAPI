const { GetInvoiceData, SelectedInvoiceData, CreateInvoiceData, UpdateInvoiceData, DeleteInvoiceData } = require('./invoices.service');
const { ValidationCreateInvoice, ValidationUpdateInvoice } = require('./invoices.validation')

const GetInvoice = async (req, res) => {
    try {
        const invoiceData = await GetInvoiceData();

        res.status(200).json({
                message: 'Invoice retrieved successfully!',
                data: invoiceData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectInvoice = async (req, res) => {
    try {
        const invoiceData = await SelectedInvoiceData(req.params.id);

        res.status(200).json({
                message: 'Invoice retrieved successfully!',
                data: invoiceData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const CreateInvoice = async (req, res) => {
    try {
        const validation = ValidationCreateInvoice(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const invoiceData = await CreateInvoiceData(req.body);

        res.status(201).json({
            message: 'Invoice created successfully!',
            data: invoiceData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const UpdateInvoice = async (req, res) => {
    try {
        const validation = ValidationUpdateInvoice(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const invoiceData = await UpdateInvoiceData(req.params.id, req.body);

        res.status(200).json({
            message: 'Invoice updated successfully!',
            data: invoiceData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeleteInvoice = async (req, res) => {
    try {
        await DeleteInvoiceData(req.params.id);
        res.status(200).json({
                message: 'Invoice deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetInvoice,
    SelectInvoice,
    CreateInvoice,
    UpdateInvoice,
    DeleteInvoice
}
