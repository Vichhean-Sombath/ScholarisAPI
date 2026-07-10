const { GetScheduleData, SelectedScheduleData, CreateScheduleData, UpdateScheduleData, DeleteScheduleData } = require('./schedules.service');
const { ValidationCreateSchedule, ValidationUpdateSchedule } = require('./schedules.validation')

const GetSchedule = async (req, res) => {
    try {
        const scheduleData = await GetScheduleData();

        res.status(200).json({
                message: 'Schedule retrieved successfully!',
                data: scheduleData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectSchedule = async (req, res) => {
    try {
        const scheduleData = await SelectedScheduleData(req.params.id);

        res.status(200).json({
                message: 'Schedule retrieved successfully!',
                data: scheduleData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
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

        const scheduleData = await CreateScheduleData(req.body);

        res.status(201).json({
            message: 'Created schedule successfully!',
            data: scheduleData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
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

        const scheduleData = await UpdateScheduleData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated schedule successfully!',
            data: scheduleData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteSchedule = async (req, res) => {
    try {
        await DeleteScheduleData(req.params.id);
        res.status(200).json({
                message: 'Deleted schedule successfully!'
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

module.exports = {
    GetSchedule,
    SelectSchedule,
    CreateSchedule,
    UpdateSchedule,
    DeleteSchedule
}
