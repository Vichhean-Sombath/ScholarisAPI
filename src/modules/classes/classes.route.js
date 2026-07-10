const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetClass, SelectClass, CreateClass, UpdateClass, DeleteClass } = require('./classes.controller');

const ClassController = app => {
    app.get('/class/data', AccessToken, Authorize('Admin', 'Teacher'), GetClass);
    app.get('/class/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectClass);
    app.post('/class/create', AccessToken, Authorize('Admin'), CreateClass);
    app.put('/class/update/:id', AccessToken, Authorize('Admin'), UpdateClass);
    app.delete('/class/delete/:id', AccessToken, Authorize('Admin'), DeleteClass);
}

module.exports = ClassController;