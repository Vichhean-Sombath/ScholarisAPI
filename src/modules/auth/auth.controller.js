const { ValidationLoginUser } = require('./auth.validation');
const { LoginUserData, LogoutUserData } = require('./auth.service');

// Login
const LoginUser = async (req, res) => {
    try {
        const validation = ValidationLoginUser(req.body);

        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            })
        }

        const loginResult = await LoginUserData(req.body);

        res.status(201).json(loginResult);

    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message,
        });
    }
};

// Logout
const LogoutUser = async (req, res) => {
    try {
        const logoutResult = await LogoutUserData();
        res.status(200).json(logoutResult);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            message: error.message || 'Internal server error!',
            error: error.statusCode ? null : error.message,
        });
    }
};

module.exports = {
    LoginUser,
    LogoutUser
}