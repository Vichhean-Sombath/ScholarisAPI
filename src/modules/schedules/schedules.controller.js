const { GetScheduleData, SelectedScheduleData, CreateScheduleData, UpdateScheduleData, DeleteScheduleData } = require('./schedules.service');
const { ValidationCreateSchedule, ValidationUpdateSchedule } = require('./schedules.validation')

const GetSchedule = async (req, res) => {
    try {
        const scheduleData = await GetScheduleData(req.user);

        res.status(200).json({
                message: 'Schedule retrieved successfully!',
                data: scheduleData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const SelectSchedule = async (req, res) => {
    try {
        const scheduleData = await SelectedScheduleData(req.params.id, req.user);

        res.status(200).json({
                message: 'Schedule retrieved successfully!',
                data: scheduleData
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const CreateSchedule = async (req, res) => {
    try {
        const validation = ValidationCreateSchedule(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const scheduleData = await CreateScheduleData(req.body, req.user);

        res.status(201).json({
            message: 'Schedule created successfully!',
            data: scheduleData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const UpdateSchedule = async (req, res) => {
    try {
        const validation = ValidationUpdateSchedule(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const scheduleData = await UpdateScheduleData(req.params.id, req.body, req.user);

        res.status(200).json({
            message: 'Schedule updated successfully!',
            data: scheduleData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

const DeleteSchedule = async (req, res) => {
    try {
        await DeleteScheduleData(req.params.id, req.user);
        res.status(200).json({
                message: 'Schedule deleted successfully!'
            });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    GetSchedule,
    SelectSchedule,
    CreateSchedule,
    UpdateSchedule,
    DeleteSchedule
}
