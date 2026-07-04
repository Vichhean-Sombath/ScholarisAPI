const bcrypt = require('bcrypt');
const Users = require('../../models/users.model');

const CreateUserData = async (userData) => {
    const { 
        userFirstName,
        userLastName,
        userRole,
        userEmail,
        userPassword,
        userAddress,
        userDOB,
        userGender
    } = userData;

    // Check existed email
    const existingEmail = await Users.findOne(
        { 
            where: {userEmail} 
        }
    );

    if(existingEmail) {
        const err = new Error('This email is already existed!');
        err.statusCode = 409;
        throw err;
    }

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = await Users.create({
        userFirstName,
        userLastName,
        userRole,
        userEmail,
        userPassword: hashedPassword,
        userAddress,
        userDOB,
        userGender
    });

    
    return {
        userID: newUser.userID,
        userFirstName: newUser.userFirstName,
        userLastName: newUser.userLastName,
        userRole: newUser.userRole,
        userEmail: newUser.userEmail,
        userAddress: newUser.userAddress,
        userDOB: newUser.userDOB,
        userGender: newUser.userGender,
        isActive: newUser.isActive
    };
}

module.exports = {
    CreateUserData
}