const { ValidationLoginUser } = require('./auth.validation');
const { LoginUserData, LogoutUserData } = require('./auth.service');

// Login
const LoginUser = async (req, res, next) => {
    try {
        const validation = ValidationLoginUser(req.body);

        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const loginResult = await LoginUserData(req.body);

        res.status(201).json(loginResult);

    } catch (error) {
        next(error);
    }
};

// Logout
const LogoutUser = async (req, res, next) => {
    try {
        const logoutResult = await LogoutUserData();
        res.status(200).json(logoutResult);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    LoginUser,
    LogoutUser
}