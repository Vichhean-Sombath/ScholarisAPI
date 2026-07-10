const AccessToken = require('../../middleware/authenticate');
const { GetSemester, SelectSemester, CreateSemester, UpdateSemester, DeleteSemester } = require('./semesters.controller');

const SemesterController = app => {
    app.get('/semester/data', AccessToken, GetSemester);
    app.get('/semester/data/:id', AccessToken, SelectSemester);
    app.post('/semester/create', AccessToken, CreateSemester);
    app.put('/semester/update/:id', AccessToken, UpdateSemester);
    app.delete('/semester/delete/:id', AccessToken, DeleteSemester);
}

module.exports = SemesterController;
