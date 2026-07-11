const jwt = require('jsonwebtoken');
const { ValidationCreateUser, ValidationUpdateUser } = require('./users.validation');
const { CreateUserData, UpdateUserData, DisableUserData, EnableUserData } = require('./users.service');

// Create
const CreateUser = async (req, res, next) => {
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
        next(error);
    }
}

// Update
const UpdateUser = async (req, res, next) => {
    try {
        const validation = ValidationUpdateUser(req.body);

        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const newUserData = await UpdateUserData(req.params.id, req.body, req.user);

        res.status(201).json({
            message: 'User updated successfully!',
            data: newUserData
        });
    } catch (error) {
        next(error);
    }
}

// Disable
const DisableUser = async (req, res, next) => {
    try {
        const disableUser = await DisableUserData(req.params.id, req.user);

        res.status(200).json({
            message: 'User deactivated successfully!',
            data: disableUser
        });
    } catch (error) {
        next(error);
    }
}

// Enable
const EnableUser = async (req, res, next) => {
    try {
        const enableUser = await EnableUserData(req.params.id, req.user);

        res.status(200).json({
            message: 'User activated successfully!',
            data: enableUser
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    CreateUser,
    UpdateUser,
    DisableUser,
    EnableUser
}