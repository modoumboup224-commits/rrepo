const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

async function createDemoOrder() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greencard');

        // Récupérer l'utilisateur producteur demo
        const user = await User.findOne({ email: 'demo.producteur@greencard.local' });
        if (!user) {
            console.log('❌ Utilisateur demo non trouvé. Lancez createDemoProducer.js d\'abord.');
            await mongoose.disconnect();
            return;
        }

        // Récupérer des produits existants
        const products = await Product.find({
            producerId: { $exists: true }
        }).limit(3);

        if (products.length === 0) {
            console.log('❌ Aucun produit trouvé. Lancez createDemoProducer.js d\'abord.');
            await mongoose.disconnect();
            return;
        }

        // Créer une commande fictive
        const demoOrder = new Order({
            userId: user._id,
            products: products.map(product => ({
                productId: product._id,
                name: product.name,
                quantity: Math.floor(Math.random() * 5) + 1,
                price: product.price
            })),
            totalAmount: products.reduce((sum, product) => sum + (product.price * (Math.floor(Math.random() * 5) + 1)), 0),
            status: 'paid',
            paymentMethod: 'stripe',
            shippingAddress: {
                street: '123 Rue de la Ferme',
                city: 'Bordeaux',
                postalCode: '33000',
                country: 'France'
            },
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const savedOrder = await demoOrder.save();
        console.log('✅ Commande fictive créée:', savedOrder._id);
        console.log('Montant total:', savedOrder.totalAmount.toFixed(2) + '€');
        console.log('Nombre de produits:', savedOrder.products.length);
        console.log('Statut:', savedOrder.status);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

createDemoOrder();
