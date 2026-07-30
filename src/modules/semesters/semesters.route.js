const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetSemester, SelectSemester, CreateSemester, UpdateSemester, DeleteSemester } = require('./semesters.controller');

const SemesterController = app => {
    app.get('/semester/data', AccessToken, Authorize('Admin', 'Teacher'), GetSemester);
    app.get('/semester/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectSemester);
    app.post('/semester/create', AccessToken, Authorize('Admin'), CreateSemester);
    app.put('/semester/update/:id', AccessToken, Authorize('Admin'), UpdateSemester);
    app.delete('/semester/delete/:id', AccessToken, Authorize('Admin'), DeleteSemester);
}

module.exports = SemesterController;
