const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../models/users.model');

const LoginUserData = async (userData) => {
    const { email, password } = userData;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
        const err = new Error('Invalid email!');
        err.statusCode = 401;
        throw err;
    }

    const isMatchPassword = await bcrypt.compare(password, user.password_hash);
    if (!isMatchPassword) {
        const err = new Error('Invalid password!');
        err.statusCode = 401;
        throw err;
    }

    await user.update({ last_login_at: new Date() });

    const token = jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' }
    );

    return {
        message: 'Login successful!',
        token,
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        }
    };
};

const LogoutUserData = async () => {
    return {
        message: 'Logout successful!'
    };
};

module.exports = {
    LoginUserData,
    LogoutUserData
};
