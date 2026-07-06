const Certificates = require('../../models/certificates.model');
const Students = require('../../models/students.model');
require('../../models/mappingContext');
const { Op } = require('sequelize');

const GetCertificateData = async () => {
    return await Certificates.findAll({
        include: [{
            model: Students,
            attributes: [ 'studentID', 'studentName' ]
        }],
        order: [['certificateIssuedDate', 'DESC']]
    });
}

const SelectCertificateData = async (data) => {
    const certificates = await Certificates.findAll({
        where: { [Op.or] : [
                { certificateID: data },
                { studentID: data },
                { certificateType: {[Op.like]: `%${data}%`}}
            ]
        },
        include:[{
            model: Students,
            attributes: ['studentID', 'studentName']
        }]
    });

    if (!certificates.length) {
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    return certificates;
}

const CreateCertificateData = async (data) => {
    const { studentID, certificateType, certificateDescription, certificateIssuedDate, certificateURL } = data;

    // If student existed
    const existedStudent = await Students.findByPk(studentID);
    if(!existedStudent){
        const err = new Error('Student not found!');
        err.statusCode = 404;
        throw err;
    }

    // Check existed
    const existedCertificate = await Certificates.findOne({ where: { studentID, certificateType } });
    if(existedCertificate){
        const err = new Error('Certificate is already existed!');
        err.statusCode = 400;
        throw err;
    }

    const createCertificate = await Certificates.create({
        studentID,
        certificateType,
        certificateDescription,
        certificateIssuedDate,
        certificateURL
    });

    return createCertificate;
}

const DeleteCertificateData = async (certificateID) => {
    const selectedCertificate = await Certificates.findByPk(certificateID);

    if(!selectedCertificate){
        const err = new Error('Certificate not found!');
        err.statusCode = 404;
        throw err;
    }

    await selectedCertificate.destroy();
}

module.exports = {
    GetCertificateData,
    SelectCertificateData,
    CreateCertificateData,
    DeleteCertificateData
}