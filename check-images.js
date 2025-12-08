const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function checkImageUrls() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB');

        const Product = require('./backend/models/Product');
        const products = await Product.find({});

        console.log('\n=== URLs des images dans la base de données ===');
        products.forEach(product => {
            console.log(`Produit: ${product.name}`);
            console.log(`  Image URL: ${product.imageUrl}`);
            console.log('---');
        });

        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

checkImageUrls();
