const AccessToken = require('../../middleware/authenticate');
const { GetLessonResource, SelectLessonResource, CreateLessonResource, UpdateLessonResource, DeleteLessonResource } = require('./lesson_resources.controller');

const LessonResourceController = app => {
    app.get('/lesson_resource/data', AccessToken, GetLessonResource);
    app.get('/lesson_resource/data/:id', AccessToken, SelectLessonResource);
    app.post('/lesson_resource/create', AccessToken, CreateLessonResource);
    app.put('/lesson_resource/update/:id', AccessToken, UpdateLessonResource);
    app.delete('/lesson_resource/delete/:id', AccessToken, DeleteLessonResource);
}

module.exports = LessonResourceController;
