const Invoices = require('../models/invoices.model');
const Students = require('../models/students.model');
const FeeStructures = require('../models/fee_structures.model');
const Semesters = require('../models/semesters.model');
const StudentEmergencyContacts = require('../models/student_emergency_contacts.model');

const findPrimaryEmergencyContact = async (student_id) => {
    return await StudentEmergencyContacts.findOne({
        where: {
            student_id,
            email: {
                [require('sequelize').Op.ne]: null
            }
        },
        order: [['contact_id', 'ASC']]
    });
};

const buildPaymentContext = async (invoice_id, payment) => {
    const invoice = await Invoices.findByPk(invoice_id, {
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: FeeStructures, attributes: ['fee_id', 'fee_name', 'amount'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] }
        ]
    });

    if (!invoice) return null;

    const student = invoice.Student;
    const fee = invoice.FeeStructure;
    const semester = invoice.Semester;
    const emergencyContact = await findPrimaryEmergencyContact(invoice.student_id);

    return {
        student: student ? `${student.first_name} ${student.last_name}` : 'Unknown student',
        student_id: invoice.student_id,
        invoice_number: invoice.invoice_number,
        invoice_id: invoice.invoice_id,
        fee_name: fee ? fee.fee_name : 'Unknown fee',
        semester_name: semester ? semester.semester_name : '',
        amount: payment.amount,
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        transaction_reference: payment.transaction_reference,
        receipt_url: payment.receipt_url,
        emergency_contact: emergencyContact
            ? {
                name: emergencyContact.contact_name,
                email: emergencyContact.email,
                phone: emergencyContact.phone_number
            }
            : null
    };
};

module.exports = {
    findPrimaryEmergencyContact,
    buildPaymentContext
};
