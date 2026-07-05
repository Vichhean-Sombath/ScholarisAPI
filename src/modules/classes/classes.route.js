const AccessToken = require('../../middleware/authenticate');
const { GetClass, SelectClass, CreateClass, UpdateClass, DeleteClass } = require('./classes.controller');

const ClassController = app => {
    app.get('/class/data', AccessToken, GetClass);
    app.get('/class/data/:id', AccessToken, SelectClass);
    app.post('/class/create', AccessToken, CreateClass);
    app.put('/class/update/:id', AccessToken, UpdateClass);
    app.delete('/class/delete/:id', AccessToken, DeleteClass);
}

module.exports = ClassController;