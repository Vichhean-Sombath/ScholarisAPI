const Certificates = require('../../models/certificates.model');
const Students = require('../../models/students.model');
const Users = require('../../models/users.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetCertificateData = async () => {
    return await Certificates.findAll({
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Users, attributes: ['user_id', 'username', 'email'] }
        ],
        order: [['issue_date', 'DESC']]
    });
};

const SelectCertificateData = async (data) => {
    const certificates = await Certificates.findAll({
        where: {
            [Op.or]: [
                { certificate_id: data },
                { student_id: data },
                { certificate_type: { [Op.like]: `%${data}%` } }
            ]
        },
        include: [
            { model: Students, attributes: ['student_id', 'first_name', 'last_name'] },
            { model: Users, attributes: ['user_id', 'username', 'email'] }
        ]
    });

    if (!certificates.length) {
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    return certificates;
};

const CreateCertificateData = async (data) => {
    const { student_id, certificate_type, template_used, issue_date, generated_file_url, issued_by } = data;

    const existedStudent = await Students.findByPk(student_id);
    if (!existedStudent) {
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    const existedUser = await Users.findByPk(issued_by);
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

    const createCertificate = await Certificates.create({
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
    const selectedCertificate = await Certificates.findByPk(certificate_id);
    if (!selectedCertificate) {
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedCertificate.destroy();
};

module.exports = {
    GetCertificateData,
    SelectCertificateData,
    CreateCertificateData,
    DeleteCertificateData
};
