const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetAcademicYear, SelectAcademicYear, CreateAcademicYear, UpdateAcademicYear, DeleteAcademicYear } = require('./academic_years.controller');

const AcademicYearController = app => {
    app.get('/academic-year/data', AccessToken, Authorize('Admin', 'Teacher'), GetAcademicYear);
    app.get('/academic-year/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectAcademicYear);
    app.post('/academic-year/create', AccessToken, Authorize('Admin'), CreateAcademicYear);
    app.put('/academic-year/update/:id', AccessToken, Authorize('Admin'), UpdateAcademicYear);
    app.delete('/academic-year/delete/:id', AccessToken, Authorize('Admin'), DeleteAcademicYear);
}

module.exports = AcademicYearController;
