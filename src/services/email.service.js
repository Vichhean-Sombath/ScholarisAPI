const nodemailer = require('nodemailer');

let transporter = null;
let configuredSender = null;

const getTransporter = () => {
    const senderAddress = process.env.EMAIL_SENDER_ADDRESS;
    const appPassword = process.env.EMAIL_APP_PASSWORD;

    if (transporter && senderAddress !== configuredSender) {
        transporter = null;
    }

    if (!transporter && senderAddress && appPassword) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: senderAddress,
                pass: appPassword
            },
            tls: {
                rejectUnauthorized: false
            },
            connection: {
                family: 4
            }
        });
        configuredSender = senderAddress;
    }
    return transporter;
};

const sendReceiptEmail = async (context) => {
    const transport = getTransporter();
    if (!transport) {
        console.warn('Email transporter not configured. Skipping receipt email.');
        return;
    }

    if (!context.emergency_contact || !context.emergency_contact.email) {
        console.warn('No emergency contact email found. Skipping receipt email.');
        return;
    }

    const { name, email } = context.emergency_contact;

    const html = [
        '<h2>Payment Receipt</h2>',
        `<p>Dear ${name},</p>`,
        `<p>A payment has been received for ${context.student}.</p>`,
        '<table border="1" cellpadding="8" cellspacing="0">',
        `<tr><td>Invoice</td><td>${context.invoice_number}</td></tr>`,
        `<tr><td>Fee</td><td>${context.fee_name}</td></tr>`,
        context.semester_name ? `<tr><td>Semester</td><td>${context.semester_name}</td></tr>` : '',
        `<tr><td>Amount</td><td>$${context.amount}</td></tr>`,
        `<tr><td>Payment Method</td><td>${context.payment_method}</td></tr>`,
        `<tr><td>Date</td><td>${new Date(context.payment_date).toLocaleString()}</td></tr>`,
        context.transaction_reference ? `<tr><td>Reference</td><td>${context.transaction_reference}</td></tr>` : '',
        '</table>',
        context.receipt_url ? `<p><a href="${context.receipt_url}">View receipt</a></p>` : '',
        '<p>Thank you,<br>Scholaris</p>'
    ]
        .filter(Boolean)
        .join('\n');

    const senderAddress = process.env.EMAIL_SENDER_ADDRESS;

    try {
        await transport.sendMail({
            from: `"Scholaris" <${senderAddress}>`,
            to: email,
            subject: `Payment Receipt - ${context.invoice_number}`,
            html
        });
        console.log('Payment receipt email sent to:', email);
    } catch (error) {
        console.error('Failed to send payment receipt email:', error.message);
    }
};

module.exports = {
    sendReceiptEmail
};
