const express = require('express');
const { CreateUser, UpdateUser, DisableUser, EnableUser } = require('./users.controller');
const AccessToken = require('../../middleware/authenticate');

const UserController = app => {
    app.post('/user/create', CreateUser);
    app.post('/user/update/:id', AccessToken, UpdateUser);
    app.delete('/user/disable/:id', AccessToken, DisableUser);
    app.post('/user/enable/:id', AccessToken, EnableUser);
}

module.exports = UserController;