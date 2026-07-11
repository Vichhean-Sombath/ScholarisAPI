const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const serverUrl = process.env.SERVER_URL;

let stripe = null;

const getStripe = () => {
    if (!stripe && stripeSecretKey) {
        stripe = Stripe(stripeSecretKey);
    }
    return stripe;
};

const createCheckoutSession = async (invoice) => {
    const stripe = getStripe();
    if (!stripe) {
        throw Object.assign(new Error('Stripe is not configured.'), { statusCode: 500 });
    }

    if (!serverUrl) {
        throw Object.assign(new Error('SERVER_URL is not configured.'), { statusCode: 500 });
    }

    const amountInCents = Math.round(parseFloat(invoice.total_amount) * 100);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: invoice.FeeStructure ? invoice.FeeStructure.fee_name : 'School fee',
                        description: `Invoice ${invoice.invoice_number}`
                    },
                    unit_amount: amountInCents
                },
                quantity: 1
            }
        ],
        metadata: {
            invoice_id: invoice.invoice_id,
            student_id: invoice.student_id,
            invoice_number: invoice.invoice_number
        },
        success_url: `${serverUrl}/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${serverUrl}/payment/stripe/cancel`
    });

    return {
        session_id: session.id,
        url: session.url
    };
};

const getSession = async (sessionId) => {
    const stripe = getStripe();
    if (!stripe) {
        throw Object.assign(new Error('Stripe is not configured.'), { statusCode: 500 });
    }

    return await stripe.checkout.sessions.retrieve(sessionId);
};

const verifyWebhookSignature = (payload, signature, secret) => {
    const stripe = getStripe();
    if (!stripe) {
        throw Object.assign(new Error('Stripe is not configured.'), { statusCode: 500 });
    }

    return stripe.webhooks.constructEvent(payload, signature, secret);
};

module.exports = {
    createCheckoutSession,
    getSession,
    verifyWebhookSignature
};
