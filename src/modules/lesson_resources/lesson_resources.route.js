const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const { GetLessonResource, SelectLessonResource, CreateLessonResource, UpdateLessonResource, DeleteLessonResource } = require('./lesson_resources.controller');

const LessonResourceController = app => {
    app.get('/lesson_resource/data', AccessToken, Authorize('Admin', 'Teacher'), GetLessonResource);
    app.get('/lesson_resource/data/:id', AccessToken, Authorize('Admin', 'Teacher'), SelectLessonResource);
    app.post('/lesson_resource/create', AccessToken, Authorize('Admin', 'Teacher'), CreateLessonResource);
    app.put('/lesson_resource/update/:id', AccessToken, Authorize('Admin', 'Teacher'), UpdateLessonResource);
    app.delete('/lesson_resource/delete/:id', AccessToken, Authorize('Admin', 'Teacher'), DeleteLessonResource);
}

module.exports = LessonResourceController;
