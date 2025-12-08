const mongoose = require('mongoose');
const Product = require('../models/Product');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greencard';

async function migrateProductImages() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connecté à MongoDB');

        // Récupérer tous les produits avec imageUrl
        const products = await Product.find({ imageUrl: { $exists: true, $ne: null } });

        console.log(`Migration de ${products.length} produits...`);

        let updatedCount = 0;

        for (const product of products) {
            if (product.imageUrl && (!product.images || product.images.length === 0)) {
                // Migrer l'image unique vers le tableau d'images
                product.images = [product.imageUrl];
                await product.save();
                updatedCount++;
                console.log(`Produit ${product.name} migré`);
            }
        }

        console.log(`Migration terminée : ${updatedCount} produits mis à jour`);

    } catch (error) {
        console.error('Erreur lors de la migration :', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Exécuter la migration
migrateProductImages();
