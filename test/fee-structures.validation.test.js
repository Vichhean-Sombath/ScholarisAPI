const test = require('node:test');
const assert = require('node:assert/strict');

const FeeStructures = require('../src/models/fee_structures.model');
const {
    ValidationCreateFeeStructure,
    ValidationUpdateFeeStructure
} = require('../src/modules/fee_structures/fee_structures.validation');

const feePayload = {
    semester_id: 1,
    fee_name: 'Tuition'
};

test('school fee accepts the $150 minimum', () => {
    const result = ValidationCreateFeeStructure({ ...feePayload, amount: 150 });

    assert.equal(result.success, true);
});

test('school fee rejects amounts below $150 on create and update', () => {
    const createResult = ValidationCreateFeeStructure({ ...feePayload, amount: 149.99 });
    const updateResult = ValidationUpdateFeeStructure({ amount: 149.99 });

    assert.equal(createResult.success, false);
    assert.deepEqual(createResult.error, ['School fee must be at least $150.']);
    assert.equal(updateResult.success, false);
    assert.deepEqual(updateResult.error, ['School fee must be at least $150.']);
});

test('fee structure model enforces the $150 minimum', async () => {
    const fee = new FeeStructures({ ...feePayload, amount: 149.99 });

    await assert.rejects(
        fee.validate(),
        (error) => error.errors.amount.message === 'School fee must be at least $150.'
    );
});
