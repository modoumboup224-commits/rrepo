const mongoose = require('mongoose');
const User = require('../models/User');
const Producteur = require('../models/Producteur');
const Product = require('../models/Product');

async function createDemoProducer() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greencard');

        // Vérifier si le producteur existe déjà
        const existingUser = await User.findOne({ email: 'demo.producteur@greencard.local' });
        if (existingUser) {
            console.log('Producteur demo existe déjà');
            await mongoose.disconnect();
            return;
        }

        // 1. Créer l'utilisateur
        const user = new User({
            username: 'producteur_test_demo',
            email: 'demo.producteur@greencard.local',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password hashé pour "password"
            role: 'producteur'
        });
        const savedUser = await user.save();
        console.log('✅ Utilisateur créé:', savedUser.username);

        // 2. Créer le profil producteur
        const producteur = new Producteur({
            nom: 'Ferme Demo Bio',
            localisation: 'Bordeaux, France',
            produits: []
        });
        const savedProducteur = await producteur.save();
        console.log('✅ Producteur créé:', savedProducteur.nom);

        // 3. Créer des produits pour ce producteur
        const demoProducts = [
            {
                name: 'Tomates Bio Cerises',
                description: 'Tomates cerises bio de notre ferme',
                price: 4.50,
                category: 'Légumes',
                stock: 50,
                producerId: savedProducteur._id,
                image: '/images/blackbox/tomates.jpg'
            },
            {
                name: 'Fraises Bio Gariguette',
                description: 'Fraises bio de saison',
                price: 6.00,
                category: 'Fruits',
                stock: 30,
                producerId: savedProducteur._id,
                image: '/images/blackbox/fraises.jpg'
            }
        ];

        const createdProducts = [];
        for (const prod of demoProducts) {
            const product = new Product(prod);
            const savedProduct = await product.save();
            createdProducts.push(savedProduct);
            console.log('✅ Produit créé:', savedProduct.name);
        }

        // 4. Mettre à jour le producteur avec ses produits
        savedProducteur.produits = createdProducts.map(p => p._id);
        await savedProducteur.save();

        console.log('\n🎉 Demo Producteur créé avec succès!');
        console.log('Email:', 'demo.producteur@greencard.local');
        console.log('Mot de passe:', 'password');
        console.log('Produits créés:', createdProducts.length);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

createDemoProducer();
