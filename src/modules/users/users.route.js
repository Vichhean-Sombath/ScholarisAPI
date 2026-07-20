const { CreateUser, UpdateUser, ChangePassword, DisableUser, EnableUser } = require('./users.controller');
const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');

const UserController = app => {
    app.post('/user/create', AccessToken, Authorize('Admin'), CreateUser);
    app.put('/user/update/:id', AccessToken, Authorize('Admin', 'Teacher', 'Student'), UpdateUser);
    app.put('/user/change-password', AccessToken, ChangePassword);
    app.delete('/user/disable/:id', AccessToken, Authorize('Admin'), DisableUser);
    app.post('/user/enable/:id', AccessToken, Authorize('Admin'), EnableUser);
}

module.exports = UserController;