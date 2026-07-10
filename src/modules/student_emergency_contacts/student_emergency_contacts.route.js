const AccessToken = require('../../middleware/authenticate');
const Authorize = require('../../middleware/authorize');
const {
    GetEmergencyContact,
    SelectEmergencyContact,
    CreateEmergencyContact,
    UpdateEmergencyContact,
    DeleteEmergencyContact
} = require('./student_emergency_contacts.controller');

const EmergencyContactController = app => {
    app.get('/student-emergency-contact/data', AccessToken, Authorize('Admin'), GetEmergencyContact);
    app.get('/student-emergency-contact/data/:id', AccessToken, Authorize('Admin'), SelectEmergencyContact);
    app.post('/student-emergency-contact/create', AccessToken, Authorize('Admin'), CreateEmergencyContact);
    app.put('/student-emergency-contact/update/:id', AccessToken, Authorize('Admin'), UpdateEmergencyContact);
    app.delete('/student-emergency-contact/delete/:id', AccessToken, Authorize('Admin'), DeleteEmergencyContact);
};

module.exports = EmergencyContactController;
