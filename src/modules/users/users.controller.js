const jwt = require('jsonwebtoken');
const { ValidationCreateUser } = require('./users.validation');
const { CreateUserData } = require('./users.service');

const CreateUser = async (req, res) => {
    try {
        const validation = ValidationCreateUser(req.body);

        // Check validation
        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            })
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
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message
        })
    }
}

module.exports = {
    CreateUser,
}