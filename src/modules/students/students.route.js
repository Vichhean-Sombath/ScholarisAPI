const express = require('express');
const { GetStudent, UpdateStudent, SelectStudent } = require('./students.controller');
const AccessToken = require('../../middleware/authenticate');

const StudentController = app => {
    app.get('/student/data', AccessToken, GetStudent);
    app.get('/student/data/:search', AccessToken, SelectStudent);
    app.put('/student/update/:id', AccessToken, UpdateStudent); // Use userID not studentID
}

module.exports = StudentController;