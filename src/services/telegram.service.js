const TelegramBot = require('node-telegram-bot-api');

let bot = null;
let configuredToken = null;

const getBot = () => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    // Re-initialize if the token changes (e.g. after dotenv loads)
    if (bot && botToken !== configuredToken) {
        bot = null;
    }

    if (!bot && botToken) {
        bot = new TelegramBot(botToken, { polling: false });
        configuredToken = botToken;
    }
    return bot;
};

const sendPaymentNotification = async (context) => {
    const bot = getBot();
    const chatId = process.env.TELEGRAM_BOT_ID;

    console.log('Preparing Telegram payment notification. Chat ID:', chatId);

    if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.warn('TELEGRAM_BOT_TOKEN not set. Skipping payment notification.');
        return;
    }
    if (!chatId) {
        console.warn('TELEGRAM_BOT_ID not set. Skipping payment notification.');
        return;
    }
    if (!bot) {
        console.warn('Telegram bot could not be initialized. Skipping payment notification.');
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
