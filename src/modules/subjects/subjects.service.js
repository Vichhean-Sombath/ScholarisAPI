const Subjects = require('../../models/subjects.model');
const { Op } = require('sequelize');

const GetSubjectData = async () => {
    return await Subjects.findAll({
        include: [{
            model: Subjects,
            as: 'Prerequisite',
            attributes: ['subject_id', 'subject_code', 'subject_name']
        }]
    });
};

const SelectedSubjectData = async (data) => {
    const selectedSubject = await Subjects.findOne({
        where: {
            [Op.or]: [
                { subject_id: data },
                { subject_code: data },
                { subject_name: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [{
            model: Subjects,
            as: 'Prerequisite',
            attributes: ['subject_id', 'subject_code', 'subject_name']
        }]
    });

    if (!selectedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    return selectedSubject;
};

const CreateSubjectData = async (subjectData) => {
    const { subject_code, subject_name, description, prerequisite_subject_id } = subjectData;

    const existedSubjectCode = await Subjects.findOne({ where: { subject_code } });
    if (existedSubjectCode) {
        const err = new Error('This subject code already exists!');
        err.statusCode = 400;
        throw err;
    }

    if (prerequisite_subject_id) {
        const prerequisite = await Subjects.findByPk(prerequisite_subject_id);
        if (!prerequisite) {
            const err = new Error('Prerequisite subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    const createSubject = await Subjects.create({
        subject_code,
        subject_name,
        description,
        prerequisite_subject_id
    });

    return createSubject;
};

const UpdateSubjectData = async (subject_id, subjectData) => {
    const selectedSubject = await Subjects.findByPk(subject_id);
    if (!selectedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    if (subjectData.subject_code && subjectData.subject_code !== selectedSubject.subject_code) {
        const existedSubjectCode = await Subjects.findOne({ where: { subject_code: subjectData.subject_code } });
        if (existedSubjectCode) {
            const err = new Error('This subject code already exists!');
            err.statusCode = 400;
            throw err;
        }
    }

    if (subjectData.prerequisite_subject_id) {
        if (parseInt(subjectData.prerequisite_subject_id) === parseInt(subject_id)) {
            const err = new Error('A subject cannot be its own prerequisite!');
            err.statusCode = 400;
            throw err;
        }

        const prerequisite = await Subjects.findByPk(subjectData.prerequisite_subject_id);
        if (!prerequisite) {
            const err = new Error('Prerequisite subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    await selectedSubject.update(subjectData);

    return selectedSubject;
};

const DeleteSubjectData = async (subject_id) => {
    const selectedSubject = await Subjects.findByPk(subject_id);
    if (!selectedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedSubject.destroy();
};

module.exports = {
    GetSubjectData,
    SelectedSubjectData,
    CreateSubjectData,
    UpdateSubjectData,
    DeleteSubjectData
};
