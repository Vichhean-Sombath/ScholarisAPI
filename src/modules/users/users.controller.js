const jwt = require('jsonwebtoken');
const { ValidationCreateUser, ValidationUpdateUser } = require('./users.validation');
const { CreateUserData, UpdateUserData, DisableUserData, EnableUserData } = require('./users.service');

// Create
const CreateUser = async (req, res) => {
    try {
        const validation = ValidationCreateUser(req.body);

        // Check validation
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        // Sync to database
        const newUser = await CreateUserData(req.body);

        res.status(201).json({
            message: 'User created successfully!',
            data: newUser
        });

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

// Update
const UpdateUser = async (req, res) => {
    try {
        const validation = ValidationUpdateUser(req.body);

        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        //                                      SelectedID, UpdateData, DataFromService
        const newUserData = await UpdateUserData(req.params.id, req.body, req.user);

        res.status(201).json({
            message: 'User updated successfully!',
            data: newUserData
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

// Disable
const DisableUser = async (req, res) => {
    try {
        const disableUser = await DisableUserData(req.params.id, req.user);

        res.status(200).json({
            message: 'User deactivated successfully!',
            data: disableUser
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

// Enable
const EnableUser = async(req, res) => {
    try {
        const enableUser = await EnableUserData(req.params.id, req.user);

        res.status(200).json({
            message: 'User activated successfully!',
            data: enableUser
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!'
        });
    }
}

module.exports = {
    CreateUser,
    UpdateUser,
    DisableUser,
    EnableUser
}