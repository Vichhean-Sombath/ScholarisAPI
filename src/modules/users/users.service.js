const bcrypt = require('bcrypt');
const Users = require('../../models/users.model');
const Students = require('../../models/students.model');
const Teachers = require('../../models/teachers.model');
require('../../models/mappingContext');

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
    
    // If the role is a student, add to table student
    if(userRole === 'student'){

        // Auto increment as S001 > S010
        const lastStudent = await Students.findOne({
            order: [['studentID', 'DESC']]
        });

        let nextNumber = 1;
        if (lastStudent) {
            const match = lastStudent.studentNumber.match(/S(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const studentNumber = `S${String(nextNumber).padStart(3, '0')}`;

        await Students.create({
            userID: newUser.userID,
            studentNumber,
            enrollmentDate: new Date()
        })
    }

    // If the role is a teacher, add to table teacher
    if(userRole === 'teacher'){
        const { teacherPosition } = userData;
        // Position
        if(!teacherPosition || teacherPosition.trim() === ''){
            const err = new Error('Teacher position is required!');
            err.statusCode = 400;
            throw err;
        }

        // Auto increment as S001 > S010
        const lastTeacher = await Students.findOne({
            order: [['teacherID', 'DESC']]
        });

        let nextNumber = 1;
        if (lastTeacher) {
            const match = lastTeacher.teacherNumber.match(/T(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        const teacherNumber = `T${String(nextNumber).padStart(3, '0')}`;

        await Teachers.create({
            userID: newUser.userID,
            teacherNumber,
            teacherPosition,
            hireDate: new Date()
        })
    }

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

// Update
//                          SelectedID, DataFormDB, CurrentUserData
const UpdateUserData = async (userID, userData, currentUser) => {

    // Check valid user
    const user = await Users.findByPk(userID);
    if(!user){
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    // Only admin or owner can edit
    if(currentUser.userRole !== 'admin' && currentUser.userID !== parseInt(userID)){
        const err = new Error('Unauthorize!');
        err.statusCode = 403;
        throw err;
    }

    // Check if existed email
    if(userData.userEmail && userData.userEmail !== user.userEmail){
        const existingEmail = await Users.findOne({ where: {userEmail: userData.userEmail} });
        if(existingEmail){
            const err = new Error('This email is already existed!');
            err.statusCode = 400;
            throw err;
        }
    }

    // Hash update password
    if(userData.userPassword) {
        userData.userPassword = await bcrypt.hash(userData.userPassword, 10);
    }

    await user.update(userData);

    return {
        userID: user.userID,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
        userRole: user.userRole,
        userAddress: user.userAddress,
        userDOB: user.userDOB,
        userGender: user.userGender,
        isActive: user.isActive
    }
}

const DisableUserData = async (userID, currentUser) => {
    // Check valid user
    const user = await Users.findByPk(userID);
    if(!user){
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    // Only admin can disable & can disable admin
    if(currentUser.userRole !== 'admin'){
        const err = new Error('Unauthorize!');
        err.statusCode = 403;
        throw err;
    }

    // Enable to disable admin account
    if(user.userRole === 'admin'){
        const err = new Error('Can not disable admin account!');
        err.statusCode = 403;
        throw err;
    }

    // Can not disable own account
    if(currentUser.userID === parseInt(userID)){
        const err = new Error('You cannot deactivate your own account!');
        err.statusCode = 403;
        throw err;
    }

    // Check if already inactive
    if(user.isActive === 'inactive'){
        const err = new Error('User is already deactivated!');
        err.statusCode = 400;
        throw err;
    }

    await user.update({ isActive: 'inactive' });

    return {
        userID: user.userID,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userRole: user.userRole,
        userEmail: user.userEmail,
        isActive: user.isActive
    }
}

// Enable
const EnableUserData = async(userID, currentUser) => {
    // Check valid user
    const user = await Users.findByPk(userID);
    if(!user){
        const err = new Error('User not found!');
        err.statusCode = 404;
        throw err;
    }

    // Only admin can disable & can disable admin
    if(currentUser.userRole !== 'admin'){
        const err = new Error('Unauthorize!');
        err.statusCode = 403;
        throw err;
    }

    // Check if already activated
    if(currentUser.isActive === 'active'){
        const err = new Error('User is already active!');
        err.statusCode = 400;
        throw err;
    }

    await user.update({ isActive: 'active' });

    return {
        userID: user.userID,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userRole: user.userRole,
        userEmail: user.userEmail,
        isActive: user.isActive
    }
}

module.exports = {
    CreateUserData,
    UpdateUserData,
    DisableUserData,
    EnableUserData
}