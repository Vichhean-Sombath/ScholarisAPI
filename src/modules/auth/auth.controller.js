const { ValidationLoginUser, ValidationRegisterUser } = require('./auth.validation');
const { LoginUserData, LogoutUserData, RegisterUserData } = require('./auth.service');

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

// Register
const RegisterUser = async (req, res, next) => {
    try {
        const validation = ValidationRegisterUser(req.body);

        if(!validation.success){
            return res.status(400).json({
                message: 'Validation failed!',
                errors: validation.error
            });
        }

        const registerResult = await RegisterUserData(req.body);

        res.status(201).json(registerResult);

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
    RegisterUser,
    LogoutUser
};
