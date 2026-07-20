const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');

const bakongAccountId = process.env.BAKONG_ACCOUNT_ID;
const merchantName = process.env.MERCHANT_NAME;
const merchantCity = process.env.MERCHANT_CITY;
const merchantPhone = process.env.MERCHANT_PHONE;
const storeLabel = process.env.STORE_LABEL;
const apiUrl = process.env.BAKONG_API_URL;
const apiToken = process.env.BAKONG_API_TOKEN;
const apiEnabled = process.env.BAKONG_API_ENABLED === 'true';

const isConfigured = () => {
    return !!(bakongAccountId && merchantName && merchantCity && merchantPhone);
};

const generateKHQR = async (invoice) => {
    if (!isConfigured()) {
        throw Object.assign(new Error('Bakong merchant details are not configured.'), { statusCode: 500 });
    }

    const amountUsd = parseFloat(invoice.total_amount);
    const amount = amountUsd > 0 ? amountUsd * 4000 : undefined;
    const feeName = invoice.FeeStructure ? invoice.FeeStructure.fee_name : 'School fee';

    const optionalData = {
        currency: khqrData.currency.khr,
        amount,
        mobileNumber: merchantPhone,
        storeLabel: storeLabel || merchantName,
        terminalLabel: `Invoice ${invoice.invoice_number}`,
        expirationTimestamp: Date.now() + (30 * 60 * 1000),
        merchantCategoryCode: '8299',
        billNumber: invoice.invoice_number,
        reference1: `inv_${invoice.invoice_id}`,
        purposeOfTransaction: feeName
    };

    const individualInfo = new IndividualInfo(
        bakongAccountId,
        merchantName,
        merchantCity,
        optionalData
    );

    const khqr = new BakongKHQR();
    const response = khqr.generateIndividual(individualInfo);

    return {
        qr_string: response.data && response.data.qr,
        md5: response.data && response.data.md5,
        amount,
        currency: 'KHR',
        invoice_id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        expiration_timestamp: optionalData.expirationTimestamp
    };
};

const checkBakongAccount = async () => {
    if (!apiEnabled || !apiUrl || !apiToken) {
        return { enabled: false };
    }

    try {
        const result = await BakongKHQR.checkBakongAccount(apiUrl, bakongAccountId);
        return { enabled: true, result };
    } catch (error) {
        return { enabled: true, error: error.message };
    }
};

module.exports = {
    generateKHQR,
    checkBakongAccount,
    isConfigured
};
