const Subjects = require('../../models/subjects.model');

const GetSubjectData = async () => {
    return await Subjects.find().populate({
        path: 'prerequisite',
        select: 'subject_id subject_code subject_name'
    });
};

const SelectedSubjectData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ subject_id: Number(data) });
    }
    orConditions.push({ subject_code: data });
    orConditions.push({ subject_name: { $regex: data, $options: 'i' } });

    const selectedSubject = await Subjects.findOne({
        $or: orConditions
    }).populate({
        path: 'prerequisite',
        select: 'subject_id subject_code subject_name'
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

    const existedSubjectCode = await Subjects.findOne({ subject_code });
    if (existedSubjectCode) {
        const err = new Error('This subject code already exists!');
        err.statusCode = 400;
        throw err;
    }

    if (prerequisite_subject_id) {
        const prerequisite = await Subjects.findOne({ subject_id: prerequisite_subject_id });
        if (!prerequisite) {
            const err = new Error('Prerequisite subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    let subject_id = subjectData.subject_id;
    if (!subject_id) {
        const lastSub = await Subjects.findOne().sort({ subject_id: -1 });
        subject_id = lastSub ? lastSub.subject_id + 1 : 1;
    }

    const createSubject = await Subjects.create({
        subject_id,
        subject_code,
        subject_name,
        description,
        prerequisite_subject_id
    });

    return createSubject;
};

const UpdateSubjectData = async (subject_id, subjectData) => {
    const selectedSubject = await Subjects.findOne({ subject_id });
    if (!selectedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    if (subjectData.subject_code && subjectData.subject_code !== selectedSubject.subject_code) {
        const existedSubjectCode = await Subjects.findOne({ subject_code: subjectData.subject_code });
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

        const prerequisite = await Subjects.findOne({ subject_id: subjectData.prerequisite_subject_id });
        if (!prerequisite) {
            const err = new Error('Prerequisite subject not found!');
            err.statusCode = 404;
            throw err;
        }
    }

    Object.assign(selectedSubject, subjectData);
    await selectedSubject.save();

    return selectedSubject;
};

const DeleteSubjectData = async (subject_id) => {
    const selectedSubject = await Subjects.findOne({ subject_id });
    if (!selectedSubject) {
        const err = new Error('Subject not found!');
        err.statusCode = 404;
        throw err;
    }

    await Subjects.deleteOne({ subject_id });
};

module.exports = {
    GetSubjectData,
    SelectedSubjectData,
    CreateSubjectData,
    UpdateSubjectData,
    DeleteSubjectData
};
