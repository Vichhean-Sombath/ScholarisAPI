const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');
const https = require('https');
const BakongQRRequests = require('../models/bakong_qr_requests.model');

const KHR_PER_USD = 4000;

const sanitizeEnv = (value) => {
    if (!value) return value;
    return String(value).replace(/[\r\n\t]/g, ' ').trim();
};

const merchantPhone = sanitizeEnv(process.env.MERCHANT_PHONE);
const bakongAccountId = sanitizeEnv(process.env.BAKONG_ACCOUNT_ID);
const merchantName = sanitizeEnv(process.env.MERCHANT_NAME);
const merchantCity = sanitizeEnv(process.env.MERCHANT_CITY);
const storeLabel = sanitizeEnv(process.env.STORE_LABEL);
const apiUrl = sanitizeEnv(process.env.BAKONG_API_URL);
const apiToken = sanitizeEnv(process.env.BAKONG_API_TOKEN);
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
    const amount = Math.round(amountUsd * KHR_PER_USD);

    const optionalData = {
        currency: khqrData.currency.khr,
        amount,
        mobileNumber: merchantPhone,
        storeLabel: truncate(storeLabel || merchantName, 25),
        expirationTimestamp: Date.now() + (30 * 60 * 1000),
        merchantCategoryCode: '8299',
        billNumber: truncate(invoice.invoice_number, 25),
    };

    const individualInfo = new IndividualInfo(
        bakongAccountId,
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

    const verifyResult = BakongKHQR.verify(response.data.qr);
    if (!verifyResult.isValid) {
        throw Object.assign(
            new Error('Generated KHQR failed internal validation.'),
            { statusCode: 500 }
        );
    }

    const lastQR = await BakongQRRequests.findOne().sort({ qr_id: -1 });
    const qr_id = lastQR && lastQR.qr_id != null ? lastQR.qr_id + 1 : 1;

    const qrRequest = await BakongQRRequests.create({
        qr_id,
        invoice_id: invoice.invoice_id,
        md5: response.data.md5,
        amount_khr: amount,
        amount_usd: amountUsd,
        status: 'Pending',
        expires_at: new Date(optionalData.expirationTimestamp)
    });

    return {
        qr_string: response.data.qr,
        md5: response.data.md5,
        qr_id: qrRequest.qr_id,
        amount,
        currency: 'KHR',
        invoice_id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        expiration_timestamp: optionalData.expirationTimestamp,
        verified: true
    };
};

const checkBakongAccount = async () => {
    if (!apiEnabled || !apiUrl || !apiToken) {
        return { enabled: false };
    }

    try {
        const baseUrl = String(apiUrl).replace(/\/+$/, '');
        const result = await BakongKHQR.checkBakongAccount(`${baseUrl}/v1/check_bakong_account`, bakongAccountId);
        return { enabled: true, result };
    } catch (error) {
        return { enabled: true, error: error.message };
    }
};

const checkTransactionByMd5 = async (md5) => {
    if (!apiEnabled || !apiUrl || !apiToken) {
        throw Object.assign(new Error('Bakong API is not enabled or not configured.'), { statusCode: 500 });
    }

    const baseUrl = String(apiUrl).replace(/\/+$/, '');
    const url = new URL(`${baseUrl}/v1/check_transaction_by_md5`);
    const body = JSON.stringify({ md5 });

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        },
        timeout: 15000
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : {};
                    resolve(parsed);
                } catch (error) {
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', (error) => reject(error));
        req.on('timeout', () => reject(new Error('Bakong API request timed out')));
        req.write(body);
        req.end();
    });
};

module.exports = {
    generateKHQR,
    checkBakongAccount,
    checkTransactionByMd5,
    isConfigured,
    KHR_PER_USD
};
