const FeeStructures = require('../../models/fee_structures.model');
const Classes = require('../../models/classes.model');
const Semesters = require('../../models/semesters.model');
const Invoices = require('../../models/invoices.model');
const ClassEnrollments = require('../../models/class_enrollments.model');
const Students = require('../../models/students.model');
const mongoose = require('mongoose');
const { generateInvoiceNumber } = require('../invoices/invoices.service');
require('../../models/mappingContext');

const sharedPopulates = [
    { path: 'class', select: 'class_id class_name' },
    { path: 'semester', select: 'semester_id semester_name' }
];

const GetFeeStructureData = async () => {
    return await FeeStructures.find().populate(sharedPopulates);
};

const SelectedFeeStructureData = async (fee_id) => {
    const feeStructure = await FeeStructures.findOne({ fee_id }).populate(sharedPopulates);

    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    return feeStructure;
};

const generateInvoicesForFee = async (fee, session) => {
    const { fee_id, class_id, semester_id, amount, due_date } = fee;
    if (!class_id || !semester_id || !amount) return 0;

    const enrollments = await ClassEnrollments.find({ class_id, status: 'Active' })
        .populate({
            path: 'student',
            match: { status: 'Active' },
            select: 'student_id'
        })
        .session(session)
        .lean();

    const activeEnrollments = enrollments.filter(e => e.student);

    if (activeEnrollments.length === 0) return 0;

    const existingInvoices = await Invoices.find({ fee_id })
        .select('student_id')
        .session(session)
        .lean();
    const existingStudentIds = new Set(existingInvoices.map((i) => Number(i.student_id)));

    const issueDate = new Date();
    const invoiceDate = due_date || issueDate;

    const lastInv = await Invoices.findOne({}, null, { session }).sort({ invoice_id: -1 });
    let nextInvoiceId = lastInv ? lastInv.invoice_id + 1 : 1;

    const invoicePayloads = [];
    let index = 0;
    for (const enrollment of activeEnrollments) {
        const studentId = Number(enrollment.student_id);
        if (existingStudentIds.has(studentId)) continue;

        invoicePayloads.push({
            invoice_id: nextInvoiceId++,
            invoice_number: generateInvoiceNumber(fee_id, studentId, index++),
            student_id: studentId,
            fee_id,
            semester_id,
            issue_date: issueDate,
            due_date: invoiceDate,
            total_amount: parseFloat(amount),
            amount_paid: 0,
            status: 'Unpaid'
        });
    }

    if (invoicePayloads.length === 0) return 0;

    await Invoices.insertMany(invoicePayloads, { session });
    return invoicePayloads.length;
};

const CreateFeeStructureData = async (feeData) => {
    const { class_id, semester_id, fee_name, amount, due_date } = feeData;

    const relatedSemester = await Semesters.findOne({ semester_id });
    if (!relatedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    if (class_id) {
        const relatedClass = await Classes.findOne({ class_id });
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let fee_id = feeData.fee_id;
        if (!fee_id) {
            const lastFee = await FeeStructures.findOne({}, null, { session }).sort({ fee_id: -1 });
            fee_id = lastFee ? lastFee.fee_id + 1 : 1;
        }

        const fee = await FeeStructures.create([{
            fee_id,
            class_id,
            semester_id,
            fee_name,
            amount,
            due_date
        }], { session });

        const invoicesGenerated = await generateInvoicesForFee(fee[0], session);

        await session.commitTransaction();
        return {
            feeStructure: fee[0],
            invoicesGenerated
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

const UpdateFeeStructureData = async (fee_id, feeData) => {
    const feeStructure = await FeeStructures.findOne({ fee_id });
    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    if (feeData.semester_id) {
        const relatedSemester = await Semesters.findOne({ semester_id: feeData.semester_id });
        if (!relatedSemester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (feeData.class_id) {
        const relatedClass = await Classes.findOne({ class_id: feeData.class_id });
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const originalAmount = parseFloat(feeStructure.amount);
    const originalDueDate = feeStructure.due_date;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const fee = await FeeStructures.findOne({ fee_id }).session(session);

        Object.assign(fee, feeData);
        await fee.save({ session });

        const finalClassId = feeData.class_id !== undefined ? feeData.class_id : fee.class_id;
        const finalSemesterId = feeData.semester_id !== undefined ? feeData.semester_id : fee.semester_id;
        const finalAmount = feeData.amount !== undefined ? parseFloat(feeData.amount) : originalAmount;
        const finalDueDate = feeData.due_date !== undefined ? feeData.due_date : originalDueDate;

        let invoicesGenerated = 0;
        if (finalClassId) {
            invoicesGenerated = await generateInvoicesForFee({
                fee_id,
                class_id: finalClassId,
                semester_id: finalSemesterId,
                amount: finalAmount,
                due_date: finalDueDate
            }, session);
        }

        const amountChanged = feeData.amount !== undefined && parseFloat(feeData.amount) !== originalAmount;
        const dueDateChanged = feeData.due_date !== undefined && feeData.due_date !== originalDueDate;

        if (amountChanged || dueDateChanged) {
            const outstandingStatuses = ['Unpaid', 'Partial'];
            await Invoices.updateMany(
                {
                    fee_id,
                    status: { $in: outstandingStatuses }
                },
                {
                    $set: {
                        total_amount: finalAmount,
                        due_date: finalDueDate || originalDueDate
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        return {
            feeStructure: fee,
            invoicesGenerated
        };
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

const DeleteFeeStructureData = async (fee_id) => {
    const feeStructure = await FeeStructures.findOne({ fee_id });
    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    await FeeStructures.deleteOne({ fee_id });
};

module.exports = {
    GetFeeStructureData,
    SelectedFeeStructureData,
    CreateFeeStructureData,
    UpdateFeeStructureData,
    DeleteFeeStructureData
};
