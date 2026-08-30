const Certificates = require('../../models/certificates.model');
const Students = require('../../models/students.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext');

const GetCertificateData = async () => {
    return await Certificates.find()
        .populate({ path: 'student', select: 'student_id first_name last_name' })
        .populate({ path: 'issuedBy', select: 'user_id username email' })
        .sort({ issue_date: -1 });
};

const SelectCertificateData = async (data) => {
    const isNum = !isNaN(Number(data));
    const orConditions = [];
    if (isNum) {
        orConditions.push({ certificate_id: Number(data) });
        orConditions.push({ student_id: Number(data) });
    }
    orConditions.push({ certificate_type: { $regex: data, $options: 'i' } });

    const certificates = await Certificates.find({
        $or: orConditions
    })
    .populate({ path: 'student', select: 'student_id first_name last_name' })
    .populate({ path: 'issuedBy', select: 'user_id username email' });

    if (!certificates.length) {
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    return certificates;
};

const CreateCertificateData = async (data) => {
    const { student_id, certificate_type, template_used, issue_date, generated_file_url, issued_by } = data;

    const existedStudent = await Students.findOne({ student_id });
    if (!existedStudent) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedUser = await Users.findOne({ user_id: issued_by });
    if (!existedUser) {
        const err = new Error('Issuer user not found!');
        err.statusCode = 404;
        throw err;
    }

    const allowedTypes = ['Completion', 'Transcript', 'Recommendation'];
    if (!allowedTypes.includes(certificate_type)) {
        const err = new Error('Certificate type must be Completion, Transcript, or Recommendation!');
        err.statusCode = 400;
        throw err;
    }

    let certificate_id = data.certificate_id;
    if (!certificate_id) {
        const lastCert = await Certificates.findOne().sort({ certificate_id: -1 });
        certificate_id = lastCert ? lastCert.certificate_id + 1 : 1;
    }

    const createCertificate = await Certificates.create({
        certificate_id,
        student_id,
        certificate_type,
        template_used,
        issue_date,
        generated_file_url,
        issued_by
    });

    return createCertificate;
};

const DeleteCertificateData = async (certificate_id) => {
    const selectedCertificate = await Certificates.findOne({ certificate_id });
    if (!selectedCertificate) {
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    await Certificates.deleteOne({ certificate_id });
};

module.exports = {
    GetCertificateData,
    SelectCertificateData,
    CreateCertificateData,
    DeleteCertificateData
};
