const express = require('express');
const { GetTeacher } = require('./teachers.controller');
const AccessToken = require('../../middleware/authenticate');

const TeacherController = app => {
    app.get('/teacher/data', AccessToken ,GetTeacher);
}

module.exports = TeacherController;