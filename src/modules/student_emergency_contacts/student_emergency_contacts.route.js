const AccessToken = require('../../middleware/authenticate');
const {
    GetEmergencyContact,
    SelectEmergencyContact,
    CreateEmergencyContact,
    UpdateEmergencyContact,
    DeleteEmergencyContact
} = require('./student_emergency_contacts.controller');

const EmergencyContactController = app => {
    app.get('/student-emergency-contact/data', AccessToken, GetEmergencyContact);
    app.get('/student-emergency-contact/data/:id', AccessToken, SelectEmergencyContact);
    app.post('/student-emergency-contact/create', AccessToken, CreateEmergencyContact);
    app.put('/student-emergency-contact/update/:id', AccessToken, UpdateEmergencyContact);
    app.delete('/student-emergency-contact/delete/:id', AccessToken, DeleteEmergencyContact);
};

module.exports = EmergencyContactController;
