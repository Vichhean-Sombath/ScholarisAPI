const { GetSemesterData, SelectedSemesterData, CreateSemesterData, UpdateSemesterData, DeleteSemesterData } = require('./semesters.service');
const { ValidationCreateSemester, ValidationUpdateSemester } = require('./semesters.validation')

const GetSemester = async (req, res, next) => {
    try {
        const semesterData = await GetSemesterData();

        res.status(200).json({
                message: 'Semester retrieved successfully!',
                data: semesterData
            });
    } catch (error) {
        next(error);
    }
}

const SelectSemester = async (req, res, next) => {
    try {
        const semesterData = await SelectedSemesterData(req.params.id);

        res.status(200).json({
                message: 'Semester retrieved successfully!',
                data: semesterData
            });
    } catch (error) {
        next(error);
    }
}

const CreateSemester = async (req, res, next) => {
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
            message: 'Semester created successfully!',
            data: semesterData
        });
    } catch (error) {
        next(error);
    }
}

const UpdateSemester = async (req, res, next) => {
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
            message: 'Semester updated successfully!',
            data: semesterData
        });
    } catch (error) {
        next(error);
    }
}

const DeleteSemester = async (req, res, next) => {
    try {
        await DeleteSemesterData(req.params.id);
        res.status(200).json({
                message: 'Semester deleted successfully!'
            });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    GetSemester,
    SelectSemester,
    CreateSemester,
    UpdateSemester,
    DeleteSemester
}
