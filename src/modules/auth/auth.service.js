const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../../models/users.model');

// Login
const LoginUserData = async (userData) => {
    const { userEmail, userPassword } = userData;

    // Find matching user
    const user = await Users.findOne({ where: { userEmail }});
    if(!user){
        const err = new Error('Invalid email!');
        err.statusCode = 401;
        throw err;
    }

    // Matching password
    const isMatchPassword = await bcrypt.compare(userPassword, user.userPassword);
    if(!isMatchPassword){
        const err = new Error('Invalid password!');
        err.statusCode = 401;
        throw err;
    }

    // Generate Token
    const token = jwt.sign(
        {
            userID: user.userID,
            userEmail: user.userEmail,
            userRole: user.userRole
        },
        process.env.SECRET_KEY,
        { expiresIn: '2h' } 
    )

    return {
        message: 'Login successful!',
        token,
        user: {
            userID: user.userID,
            userFirstName: user.userFirstName,
            userLastName: user.userLastName,
            userEmail: user.userEmail,
            userRole: user.userRole
        }
    }
}

// Logout
const LogoutUserData = async () => {
    return {
        message: 'Logout successful!'
    };
}

module.exports = {
    LoginUserData,
    LogoutUserData
}