const { GetTimeSlotData, SelectedTimeSlotData, CreateTimeSlotData, UpdateTimeSlotData, DeleteTimeSlotData } = require('./time_slots.service');
const { ValidationCreateTimeSlot, ValidationUpdateTimeSlot } = require('./time_slots.validation')

const GetTimeSlot = async (req, res) => {
    try {
        const timeSlotData = await GetTimeSlotData();

        res.status(200).json({
                message: 'Time slot retrieved successfully!',
                data: timeSlotData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectTimeSlot = async (req, res) => {
    try {
        const timeSlotData = await SelectedTimeSlotData(req.params.id);

        res.status(200).json({
                message: 'Time slot retrieved successfully!',
                data: timeSlotData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const CreateTimeSlot = async (req, res) => {
    try {
        const validation = ValidationCreateTimeSlot(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const timeSlotData = await CreateTimeSlotData(req.body);

        res.status(201).json({
            message: 'Time slot created successfully!',
            data: timeSlotData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const UpdateTimeSlot = async (req, res) => {
    try {
        const validation = ValidationUpdateTimeSlot(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const timeSlotData = await UpdateTimeSlotData(req.params.id, req.body);

        res.status(200).json({
            message: 'Time slot updated successfully!',
            data: timeSlotData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeleteTimeSlot = async (req, res) => {
    try {
        await DeleteTimeSlotData(req.params.id);
        res.status(200).json({
                message: 'Time slot deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetTimeSlot,
    SelectTimeSlot,
    CreateTimeSlot,
    UpdateTimeSlot,
    DeleteTimeSlot
}
