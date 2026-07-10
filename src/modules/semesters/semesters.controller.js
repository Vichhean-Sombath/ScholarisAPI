const { GetSemesterData, SelectedSemesterData, CreateSemesterData, UpdateSemesterData, DeleteSemesterData } = require('./semesters.service');
const { ValidationCreateSemester, ValidationUpdateSemester } = require('./semesters.validation')

const GetSemester = async (req, res) => {
    try {
        const semesterData = await GetSemesterData();

        res.status(200).json({
                message: 'Semester retrieved successfully!',
                data: semesterData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const SelectSemester = async (req, res) => {
    try {
        const semesterData = await SelectedSemesterData(req.params.id);

        res.status(200).json({
                message: 'Semester retrieved successfully!',
                data: semesterData
            })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const CreateSemester = async (req, res) => {
    try {
        const validation = ValidationCreateSemester(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const semesterData = await CreateSemesterData(req.body);

        res.status(201).json({
            message: 'Created semester successfully!',
            data: semesterData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const UpdateSemester = async (req, res) => {
    try {
        const validation = ValidationUpdateSemester(req.body);
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const semesterData = await UpdateSemesterData(req.params.id, req.body);

        res.status(200).json({
            message: 'Updated semester successfully!',
            data: semesterData
        })
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

const DeleteSemester = async (req, res) => {
    try {
        await DeleteSemesterData(req.params.id);
        res.status(200).json({
                message: 'Deleted semester successfully!'
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
    GetSemester,
    SelectSemester,
    CreateSemester,
    UpdateSemester,
    DeleteSemester
}
