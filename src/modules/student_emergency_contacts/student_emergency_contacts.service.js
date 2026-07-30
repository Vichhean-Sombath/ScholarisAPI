const StudentEmergencyContacts = require('../../models/student_emergency_contacts.model');
const Students = require('../../models/students.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetEmergencyContactData = async () => {
    return await StudentEmergencyContacts.findAll({
        include: {
            model: Students,
            attributes: ['student_id', 'first_name', 'last_name']
        }
    });
};

const SelectedEmergencyContactData = async (data) => {
    const selectedContact = await StudentEmergencyContacts.findOne({
        where: {
            [Op.or]: [
                { contact_id: data },
                { contact_name: { [Op.like]: `%${data}%` } },
                { phone_number: { [Op.like]: `%${data}%` } }
            ]
        },
        include: {
            model: Students,
            attributes: ['student_id', 'first_name', 'last_name']
        }
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

    const student = await Students.findByPk(student_id);
    if (!student) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const createContact = await StudentEmergencyContacts.create({
        student_id,
        contact_name,
        relationship,
        phone_number,
        email
    });

    return createContact;
};

const UpdateEmergencyContactData = async (contact_id, contactData) => {
    const selectedContact = await StudentEmergencyContacts.findByPk(contact_id);
    if (!selectedContact) {
        const err = new Error('Emergency contact not found!');
        err.statusCode = 404;
        throw err;
    }

    if (contactData.student_id !== undefined) {
        const student = await Students.findByPk(contactData.student_id);
        if (!student) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedContact.update(contactData);

    return selectedContact;
};

const DeleteEmergencyContactData = async (contact_id) => {
    const selectedContact = await StudentEmergencyContacts.findByPk(contact_id);
    if (!selectedContact) {
        const err = new Error('Emergency contact not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedContact.destroy();
};

module.exports = {
    GetEmergencyContactData,
    SelectedEmergencyContactData,
    CreateEmergencyContactData,
    UpdateEmergencyContactData,
    DeleteEmergencyContactData
};
