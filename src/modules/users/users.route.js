const express = require('express');
const { CreateUser } = require('./users.controller');

const UserController = app => {
    app.post('/user/create', CreateUser);
}

module.exports = UserController;