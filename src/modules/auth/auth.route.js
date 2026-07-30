const express = require('express');
const { LoginUser, RegisterUser, LogoutUser } = require('./auth.controller');
const AccessToken = require('../../middleware/authenticate');

const AuthController = app => {
    app.post('/user/login', LoginUser);
    app.post('/user/register', RegisterUser);
    app.post('/user/logout', AccessToken, LogoutUser);
}

module.exports = AuthController;
