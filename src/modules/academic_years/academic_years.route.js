const AccessToken = require('../../middleware/authenticate');
const { GetAcademicYear, SelectAcademicYear, CreateAcademicYear, UpdateAcademicYear, DeleteAcademicYear } = require('./academic_years.controller');

const AcademicYearController = app => {
    app.get('/academic-year/data', AccessToken, GetAcademicYear);
    app.get('/academic-year/data/:id', AccessToken, SelectAcademicYear);
    app.post('/academic-year/create', AccessToken, CreateAcademicYear);
    app.put('/academic-year/update/:id', AccessToken, UpdateAcademicYear);
    app.delete('/academic-year/delete/:id', AccessToken, DeleteAcademicYear);
}

module.exports = AcademicYearController;
