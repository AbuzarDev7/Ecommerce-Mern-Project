const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // amount in cents
            currency: 'usd',
            payment_method_types: ['card']
        });
        return paymentIntent;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { createPaymentIntent };
