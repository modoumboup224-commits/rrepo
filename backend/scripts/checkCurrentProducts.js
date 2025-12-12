const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const checkCurrentProducts = async () => {
    try {
        console.log('🔍 Vérification des produits actuels dans la base de données...');

        // Récupérer tous les produits
        const products = await Product.find({});
        console.log(`📊 ${products.length} produits trouvés`);

        // Afficher les détails de chaque produit
        products.forEach((product, index) => {
            console.log(`\n${index + 1}. ${product.name}`);
            console.log(`   ID: ${product._id}`);
            console.log(`   Image URL: ${product.imageUrl}`);
            console.log(`   Images: ${JSON.stringify(product.images)}`);
            console.log(`   Prix: ${product.price}€`);
            console.log(`   Producteur: ${product.producteur}`);
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

checkCurrentProducts();
