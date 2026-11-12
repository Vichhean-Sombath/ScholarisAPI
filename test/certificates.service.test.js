const test = require('node:test');
const assert = require('node:assert/strict');

const Certificates = require('../src/models/certificates.model');
const { GetCertificateData } = require('../src/modules/certificates/certificates.service');

test('certificate list populates relationships defined by the Mongoose schema', async () => {
    const originalFind = Certificates.find;
    const populatedPaths = [];

    try {
        Certificates.find = () => ({
            populate(options) {
                populatedPaths.push(options.path);
                return this;
            },
            async sort() {
                return [];
            }
        });

        const certificates = await GetCertificateData();

        assert.deepEqual(certificates, []);
        assert.deepEqual(populatedPaths, ['student', 'user']);
    } finally {
        Certificates.find = originalFind;
    }
});
