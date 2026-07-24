const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');

const merchantPhone = process.env.MERCHANT_PHONE;
const bakongAccountId = process.env.BAKONG_ACCOUNT_ID;
const merchantName = process.env.MERCHANT_NAME;
const merchantCity = process.env.MERCHANT_CITY;
const storeLabel = process.env.STORE_LABEL;
const apiUrl = process.env.BAKONG_API_URL;
const apiToken = process.env.BAKONG_API_TOKEN;
const apiEnabled = process.env.BAKONG_API_ENABLED === 'true';

const isConfigured = () => {
    return !!(bakongAccountId && merchantName && merchantCity && merchantPhone);
};

const truncate = (value, length) => {
    if (value == null) return value;
    const string = String(value);
    return string.length > length ? string.slice(0, length) : string;
};

const generateKHQR = async (invoice) => {
    if (!isConfigured()) {
        throw Object.assign(new Error('Bakong merchant details are not configured.'), { statusCode: 500 });
    }

    const amountUsd = parseFloat(invoice.total_amount);
    if (!amountUsd || amountUsd <= 0) {
        throw Object.assign(new Error('Invoice amount must be greater than zero to generate a KHQR.'), { statusCode: 400 });
    }
    const amount = Math.round(amountUsd * 4000);
    const feeName = invoice.FeeStructure ? invoice.FeeStructure.fee_name : 'School fee';

    const optionalData = {
        currency: khqrData.currency.khr,
        amount,
        mobileNumber: merchantPhone,
        storeLabel: truncate(storeLabel || merchantName, 25),
        terminalLabel: truncate(`Invoice ${invoice.invoice_number}`, 25),
        expirationTimestamp: Date.now() + (30 * 60 * 1000),
        merchantCategoryCode: '8299',
        billNumber: truncate(invoice.invoice_number, 25),
        reference1: truncate(`inv_${invoice.invoice_id}`, 25),
        purposeOfTransaction: truncate(feeName, 25)
    };

    const individualInfo = new IndividualInfo(
        bakongAccountId,
        khqrData.currency.khr,
        truncate(merchantName, 15),
        truncate(merchantCity, 15),
        optionalData
    );

    const khqr = new BakongKHQR();
    const response = khqr.generateIndividual(individualInfo);

    if (!response.status || response.status.code !== 0) {
        throw Object.assign(
            new Error(response.status && response.status.message || 'KHQR generation failed.'),
            { statusCode: 500 }
        );
    }

    if (!response.data || !response.data.qr) {
        throw Object.assign(
            new Error('KHQR generation did not return a QR string.'),
            { statusCode: 500 }
        );
    }

    return {
        qr_string: response.data.qr,
        md5: response.data.md5,
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
