const Invoices = require('../../models/invoices.model');
const Students = require('../../models/students.model');
const FeeStructures = require('../../models/fee_structures.model');
const Semesters = require('../../models/semesters.model');
require('../../models/mappingContext');

const computeInvoiceStatus = (total, paid) => {
    if (paid >= total) return 'Paid';
    if (paid > 0) return 'Partial';
    return 'Unpaid';
};

const generateInvoiceNumber = (feeId, studentId, index = 0) => {
    const timestamp = Date.now();
    return `INV-${feeId}-${studentId}-${timestamp}-${index}`;
};

const sharedPopulates = [
    { path: 'student', select: 'student_id first_name last_name' },
    { path: 'feeStructure', select: 'fee_id fee_name amount' },
    { path: 'semester', select: 'semester_id semester_name' }
];

const GetInvoiceData = async () => {
    return await Invoices.find().populate(sharedPopulates);
};

const SelectedInvoiceData = async (invoice_id) => {
    const invoice = await Invoices.findOne({ invoice_id }).populate(sharedPopulates);

    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    return invoice;
};

const CreateInvoiceData = async (invoiceData) => {
    const { invoice_number, student_id, fee_id, semester_id, issue_date, due_date, total_amount, amount_paid, status } = invoiceData;

    const relatedStudent = await Students.findOne({ student_id });
    if (!relatedStudent) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedFee = await FeeStructures.findOne({ fee_id });
    if (!relatedFee) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    const relatedSemester = await Semesters.findOne({ semester_id });
    if (!relatedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    const existingInvoice = await Invoices.findOne({ invoice_number });
    if (existingInvoice) {
        const err = new Error('Invoice number already exists!');
        err.statusCode = 409;
        throw err;
    }

    const paid = amount_paid !== undefined ? parseFloat(amount_paid) : 0;
    const total = parseFloat(total_amount);
    const computedStatus = status || computeInvoiceStatus(total, paid);

    let invoice_id = invoiceData.invoice_id;
    if (!invoice_id) {
        const lastInv = await Invoices.findOne().sort({ invoice_id: -1 });
        invoice_id = lastInv ? lastInv.invoice_id + 1 : 1;
    }

    return await Invoices.create({
        invoice_id,
        invoice_number,
        student_id,
        fee_id,
        semester_id,
        issue_date,
        due_date,
        total_amount: total,
        amount_paid: paid,
        status: computedStatus
    });
};

const UpdateInvoiceData = async (invoice_id, invoiceData) => {
    const invoice = await Invoices.findOne({ invoice_id });
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    if (invoiceData.student_id) {
        const relatedStudent = await Students.findOne({ student_id: invoiceData.student_id });
        if (!relatedStudent) {
            const err = new Error('Student not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (invoiceData.fee_id) {
        const relatedFee = await FeeStructures.findOne({ fee_id: invoiceData.fee_id });
        if (!relatedFee) {
            const err = new Error('Fee structure not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (invoiceData.semester_id) {
        const relatedSemester = await Semesters.findOne({ semester_id: invoiceData.semester_id });
        if (!relatedSemester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (invoiceData.invoice_number && invoiceData.invoice_number !== invoice.invoice_number) {
        const existingInvoice = await Invoices.findOne({
            invoice_number: invoiceData.invoice_number,
            invoice_id: { $ne: invoice_id }
        });
        if (existingInvoice) {
            const err = new Error('Invoice number already exists!');
            err.statusCode = 409;
            throw err;
        }
    }

    const total = invoiceData.total_amount !== undefined ? parseFloat(invoiceData.total_amount) : parseFloat(invoice.total_amount);
    const paid = invoiceData.amount_paid !== undefined ? parseFloat(invoiceData.amount_paid) : parseFloat(invoice.amount_paid);
    const finalStatus = invoiceData.status || computeInvoiceStatus(total, paid);

    Object.assign(invoice, invoiceData, {
        status: finalStatus
    });
    await invoice.save();

    return invoice;
};

const DeleteInvoiceData = async (invoice_id) => {
    const invoice = await Invoices.findOne({ invoice_id });
    if (!invoice) {
        const err = new Error('Invoice not found!');
        err.statusCode = 404;
        throw err;
    }

    await Invoices.deleteOne({ invoice_id });
};

module.exports = {
    GetInvoiceData,
    SelectedInvoiceData,
    CreateInvoiceData,
    UpdateInvoiceData,
    DeleteInvoiceData,
    generateInvoiceNumber
};
