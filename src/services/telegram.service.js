const TelegramBot = require('node-telegram-bot-api');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_BOT_ID;

let bot = null;

const getBot = () => {
    if (!bot && botToken) {
        bot = new TelegramBot(botToken, { polling: false });
    }
    return bot;
};

const sendPaymentNotification = async (context) => {
    const bot = getBot();
    if (!bot || !chatId) {
        console.warn('Telegram bot not configured. Skipping payment notification.');
        return;
    }

    const message = [
        'New payment received',
        '',
        `Student: ${context.student}`,
        `Invoice: ${context.invoice_number}`,
        `Fee: ${context.fee_name}`,
        context.semester_name ? `Semester: ${context.semester_name}` : null,
        `Amount: $${context.amount}`,
        `Method: ${context.payment_method}`,
        `Date: ${new Date(context.payment_date).toLocaleString()}`,
        context.transaction_reference ? `Reference: ${context.transaction_reference}` : null
    ]
        .filter(Boolean)
        .join('\n');

    try {
        await bot.sendMessage(chatId, message);
        console.log('Telegram payment notification sent.');
    } catch (error) {
        console.error('Failed to send Telegram payment notification:', error.message);
    }
};

module.exports = {
    sendPaymentNotification
};
