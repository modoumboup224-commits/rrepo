import express from 'express';
import Stripe from 'stripe';
const { default: Order } = await import('../models/Order.js');


// IMPORTANT: ne pas initialiser Stripe au chargement du module (sinon ça crash si la clé env manque).
const router = express.Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        // Ne pas crasher au démarrage (Render) si l'env n'est pas encore injectée.
        // La route échouera clairement au moment d'un webhook.
        return null;
    }
    return Stripe(process.env.STRIPE_SECRET_KEY);
}



router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Retrieve userId or customer info from session metadata or client_reference_id
        const userId = session.client_reference_id; // assuming client_reference_id is userId

        // Retrieve line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Map line items to order products
        const products = lineItems.data.map(item => ({
            productId: null, // Could be stored in metadata if available
            name: item.description,
            quantity: item.quantity,
            price: item.amount_total / 100
        }));

        // Create and save order
        const order = new Order({
            userId,
            products,
            date: new Date(),
            status: 'paid'
        });

        try {
            await order.save();
            console.log('Order saved:', order);
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    res.json({ received: true });
});

export default router;

