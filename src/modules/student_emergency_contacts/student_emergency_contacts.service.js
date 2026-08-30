const StudentEmergencyContacts = require('../../models/student_emergency_contacts.model');
const Students = require('../../models/students.model');
require('../../models/mappingContext');

const GetEmergencyContactData = async () => {
    return await StudentEmergencyContacts.find().populate({
        path: 'student',
        select: 'student_id first_name last_name'
    });
};

const SelectedEmergencyContactData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ contact_id: Number(data) });
    }
    orConditions.push({ contact_name: { $regex: data, $options: 'i' } });
    orConditions.push({ phone_number: { $regex: data, $options: 'i' } });

    const selectedContact = await StudentEmergencyContacts.findOne({
        $or: orConditions
    }).populate({
        path: 'student',
        select: 'student_id first_name last_name'
    });

    if (!selectedContact) {
        const err = new Error('Emergency contact not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedContact;
};

const CreateEmergencyContactData = async (contactData) => {
    const { student_id, contact_name, relationship, phone_number, email } = contactData;

    const student = await Students.findOne({ student_id });
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    let contact_id = contactData.contact_id;
    if (!contact_id) {
        const lastContact = await StudentEmergencyContacts.findOne().sort({ contact_id: -1 });
        contact_id = lastContact ? lastContact.contact_id + 1 : 1;
    }

    const createContact = await StudentEmergencyContacts.create({
        contact_id,
        student_id,
        contact_name,
        relationship,
        phone_number,
        email
    });

    return createContact;
};

const UpdateEmergencyContactData = async (contact_id, contactData) => {
    const selectedContact = await StudentEmergencyContacts.findOne({ contact_id });
    if (!selectedContact) {
        const err = new Error('Emergency contact not found!');
        err.statusCode = 404;
        throw err;
    }

    if (contactData.student_id !== undefined) {
        const student = await Students.findOne({ student_id: contactData.student_id });
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(selectedContact, contactData);
    await selectedContact.save();

    return selectedContact;
};

const DeleteEmergencyContactData = async (contact_id) => {
    const selectedContact = await StudentEmergencyContacts.findOne({ contact_id });
    if (!selectedContact) {
        const err = new Error('Emergency contact not found!');
        err.statusCode = 404;
        throw err;
    }

    await StudentEmergencyContacts.deleteOne({ contact_id });
};

module.exports = {
    GetEmergencyContactData,
    SelectedEmergencyContactData,
    CreateEmergencyContactData,
    UpdateEmergencyContactData,
    DeleteEmergencyContactData
};
