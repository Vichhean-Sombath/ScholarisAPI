const FeeStructures = require('../../models/fee_structures.model');
const Classes = require('../../models/classes.model');
const Semesters = require('../../models/semesters.model');
const Invoices = require('../../models/invoices.model');
const ClassEnrollments = require('../../models/class_enrollments.model');
const Students = require('../../models/students.model');
const sequelize = require('../../config/db');
const { generateInvoiceNumber } = require('../invoices/invoices.service');

const GetFeeStructureData = async () => {
    return await FeeStructures.findAll({
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] }
        ]
    });
};

const SelectedFeeStructureData = async (fee_id) => {
    const feeStructure = await FeeStructures.findByPk(fee_id, {
        include: [
            { model: Classes, attributes: ['class_id', 'class_name'] },
            { model: Semesters, attributes: ['semester_id', 'semester_name'] }
        ]
    });

    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    return feeStructure;
};

const generateInvoicesForFee = async (fee, transaction) => {
    const { fee_id, class_id, semester_id, amount, due_date } = fee;
    if (!class_id || !semester_id || !amount) return 0;

    const enrollments = await ClassEnrollments.findAll({
        where: { class_id, status: 'Active' },
        include: [
            {
                model: Students,
                where: { status: 'Active' },
                attributes: ['student_id'],
                required: true
            }
        ],
        transaction
    });

    if (enrollments.length === 0) return 0;

    const existingInvoices = await Invoices.findAll({
        where: { fee_id },
        attributes: ['student_id'],
        transaction
    });
    const existingStudentIds = new Set(existingInvoices.map((i) => Number(i.student_id)));

    const issueDate = new Date();
    const invoiceDate = due_date || issueDate;

    const invoicePayloads = [];
    let index = 0;
    for (const enrollment of enrollments) {
        const studentId = Number(enrollment.student_id);
        if (existingStudentIds.has(studentId)) continue;

        invoicePayloads.push({
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

    await Invoices.bulkCreate(invoicePayloads, { transaction });
    return invoicePayloads.length;
};

const CreateFeeStructureData = async (feeData) => {
    const { class_id, semester_id, fee_name, amount, due_date } = feeData;

    const relatedSemester = await Semesters.findByPk(semester_id);
    if (!relatedSemester) {
        const err = new Error('Semester not found!');
        err.statusCode = 404;
        throw err;
    }

    if (class_id) {
        const relatedClass = await Classes.findByPk(class_id);
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    return await sequelize.transaction(async (transaction) => {
        const fee = await FeeStructures.create({
            class_id,
            semester_id,
            fee_name,
            amount,
            due_date
        }, { transaction });

        const invoicesGenerated = await generateInvoicesForFee(fee, transaction);

        return {
            feeStructure: fee,
            invoicesGenerated
        };
    });
};

const UpdateFeeStructureData = async (fee_id, feeData) => {
    const feeStructure = await FeeStructures.findByPk(fee_id);
    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    if (feeData.semester_id) {
        const relatedSemester = await Semesters.findByPk(feeData.semester_id);
        if (!relatedSemester) {
            const err = new Error('Semester not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    if (feeData.class_id) {
        const relatedClass = await Classes.findByPk(feeData.class_id);
        if (!relatedClass) {
            const err = new Error('Class not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const originalAmount = parseFloat(feeStructure.amount);
    const originalDueDate = feeStructure.due_date;

    return await sequelize.transaction(async (transaction) => {
        await feeStructure.update(feeData, { transaction });

        const finalClassId = feeData.class_id !== undefined ? feeData.class_id : feeStructure.class_id;
        const finalSemesterId = feeData.semester_id !== undefined ? feeData.semester_id : feeStructure.semester_id;
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
            }, transaction);
        }

        const amountChanged = feeData.amount !== undefined && parseFloat(feeData.amount) !== originalAmount;
        const dueDateChanged = feeData.due_date !== undefined && feeData.due_date !== originalDueDate;

        if (amountChanged || dueDateChanged) {
            const outstandingStatuses = ['Unpaid', 'Partial'];
            await Invoices.update(
                {
                    total_amount: finalAmount,
                    due_date: finalDueDate || originalDueDate
                },
                {
                    where: {
                        fee_id,
                        status: outstandingStatuses
                    },
                    transaction
                }
            );
        }

        return {
            feeStructure,
            invoicesGenerated
        };
    });
};

const DeleteFeeStructureData = async (fee_id) => {
    const feeStructure = await FeeStructures.findByPk(fee_id);
    if (!feeStructure) {
        const err = new Error('Fee structure not found!');
        err.statusCode = 404;
        throw err;
    }

    await feeStructure.destroy();
};

module.exports = {
    GetFeeStructureData,
    SelectedFeeStructureData,
    CreateFeeStructureData,
    UpdateFeeStructureData,
    DeleteFeeStructureData
};
