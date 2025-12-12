const mongoose = require('mongoose');
const Product = require('../models/Product');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/greencart', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fixProductImages = async () => {
    try {
        console.log('🔍 Mise à jour des images des produits...');

        // Images disponibles
        const availableImages = [
            '/images/blackbox/abricots.jpg',
            '/images/blackbox/bananes.jpg',
            '/images/blackbox/carottes.jpg',
            '/images/blackbox/cerises.jpg',
            '/images/blackbox/choux.jpg',
            '/images/blackbox/concombres.jpg',
            '/images/blackbox/courgettes.jpg',
            '/images/blackbox/epinards.jpg',
            '/images/blackbox/fraises.jpg',
            '/images/blackbox/framboises.jpg',
            '/images/blackbox/haricots.jpg',
            '/images/blackbox/kiwi.jpg',
            '/images/blackbox/mdl.jpg',
            '/images/blackbox/Melons.jpg',
            '/images/blackbox/navets.jpg',
            '/images/blackbox/oranges.jpg',
            '/images/blackbox/peches.jpg',
            '/images/blackbox/poires.jpg',
            '/images/blackbox/pois.jpg',
            '/images/blackbox/poivrons.jpg',
            '/images/blackbox/pomme.jpg',
            '/images/blackbox/raisins.jpg',
            '/images/blackbox/tomates.jpg',
            '/images/blackbox2/1.jpg',
            '/images/blackbox2/11.jpg',
            '/images/blackbox2/111.jpg'
        ];

        // 1. Récupérer tous les produits
        const products = await Product.find({});
        console.log(`📊 ${products.length} produits trouvés`);

        let updatedCount = 0;

        // 2. Mettre à jour chaque produit avec une image aléatoire
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const randomImage = availableImages[i % availableImages.length];

            // Utiliser updateOne pour éviter les problèmes de validation
            await Product.updateOne(
                { _id: product._id },
                {
                    imageUrl: randomImage,
                    images: [randomImage]
                }
            );
            updatedCount++;
            console.log(`✅ ${product.name}: ${randomImage}`);
        }

        console.log(`\n📋 Résumé: ${updatedCount} produits mis à jour avec de nouvelles images`);

    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🏁 Script terminé');
    }
};

fixProductImages();
