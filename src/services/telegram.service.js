const { TelegramBot } = require('node-telegram-bot-api');

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

    const escapeHtml = (value) =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

    const label = (text) => `<b>${escapeHtml(text)}</b>`;
    const value = (text) => escapeHtml(text);
    const formattedAmount = parseFloat(context.amount || 0).toFixed(2);
    const formattedDate = new Date(context.payment_date).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const lines = [
        `<b>New Payment Received</b>`,
        '',
        `${label('Student:')} ${value(context.student)}`,
        `${label('Invoice:')} ${value(context.invoice_number)}`,
        `${label('Fee:')} ${value(context.fee_name)}`,
        context.semester_name ? `${label('Semester:')} ${value(context.semester_name)}` : null,
        '',
        `${label('Amount:')} $${value(formattedAmount)}`,
        `${label('Method:')} ${value(context.payment_method)}`,
        `${label('Date:')} ${value(formattedDate)}`,
        context.transaction_reference ? `${label('Reference:')} ${value(context.transaction_reference)}` : null,
        context.receipt_url ? `${label('Receipt:')} <a href="${escapeHtml(context.receipt_url)}">View receipt</a>` : null
    ].filter(Boolean);

    const message = lines.join('\n');

    try {
        await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        console.log('Telegram payment notification sent.');
    } catch (error) {
        console.error('Failed to send Telegram payment notification:', error.message);
    }
};

module.exports = {
    sendPaymentNotification
};
