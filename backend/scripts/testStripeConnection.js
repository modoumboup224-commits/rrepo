require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function testConnection() {
    try {
        const balance = await stripe.balance.retrieve();
        console.log('Stripe connection successful. Balance:', balance);
    } catch (error) {
        console.error('Stripe connection failed:', error);
    }
}

testConnection();
