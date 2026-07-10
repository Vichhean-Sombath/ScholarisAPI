const FeeStructures = require('../../models/fee_structures.model');
const Classes = require('../../models/classes.model');
const Semesters = require('../../models/semesters.model');

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

    return await FeeStructures.create({
        class_id,
        semester_id,
        fee_name,
        amount,
        due_date
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

    await feeStructure.update(feeData);

    return feeStructure;
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
