const express = require('express');
const { GetStudent } = require('./students.controller');
const AccessToken = require('../../middleware/authenticate');

const StudentController = app => {
    app.get('/student/data', AccessToken, GetStudent);
}

module.exports = StudentController;