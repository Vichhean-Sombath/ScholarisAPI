const { GetPaymentData, SelectedPaymentData, CreatePaymentData, UpdatePaymentData, DeletePaymentData } = require('./payments.service');
const { ValidationCreatePayment, ValidationUpdatePayment } = require('./payments.validation')

const GetPayment = async (req, res) => {
    try {
        const paymentData = await GetPaymentData();

        res.status(200).json({
                message: 'Payment retrieved successfully!',
                data: paymentData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectPayment = async (req, res) => {
    try {
        const paymentData = await SelectedPaymentData(req.params.id);

        res.status(200).json({
                message: 'Payment retrieved successfully!',
                data: paymentData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const CreatePayment = async (req, res) => {
    try {
        const validation = ValidationCreatePayment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const paymentData = await CreatePaymentData(req.body);

        res.status(201).json({
            message: 'Payment created successfully!',
            data: paymentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const UpdatePayment = async (req, res) => {
    try {
        const validation = ValidationUpdatePayment(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const paymentData = await UpdatePaymentData(req.params.id, req.body);

        res.status(200).json({
            message: 'Payment updated successfully!',
            data: paymentData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeletePayment = async (req, res) => {
    try {
        await DeletePaymentData(req.params.id);
        res.status(200).json({
                message: 'Payment deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetPayment,
    SelectPayment,
    CreatePayment,
    UpdatePayment,
    DeletePayment
}
