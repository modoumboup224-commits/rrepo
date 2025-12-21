#!/usr/bin/env node

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Modèle Product
const Product = require('../models/Product');

// Modèle Producteur
const Producteur = require('../models/Producteur');

// Données de produits de démonstration
const demoProducts = [
    {
        name: "Tomates Bio",
        description: "Tomates rouges biologiques, cultivées sans pesticides",
        price: 3.50,
        category: "légumes",
        stock: 50,
        image: "/images/blackbox/tomates.jpg",
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        region: "Provence-Alpes-Côte d'Azur",
        isActive: true
    },
    {
        name: "Carottes Bio",
        description: "Carottes fraîches et croquantes, cultivées localement",
        price: 2.80,
        category: "légumes",
        stock: 75,
        image: "/images/blackbox/carottes.jpg",
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 jours
        region: "Île-de-France",
        isActive: true
    },
    {
        name: "Pommes Bio",
        description: "Pommes rouges juteuses, récoltées à maturité",
        price: 4.20,
        category: "fruits",
        stock: 40,
        image: "/images/blackbox/pomme.jpg",
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        region: "Normandie",
        isActive: true
    },
    {
        name: "Fraises Bio",
        description: "Fraises fraîches et sucrées, parfaites pour les desserts",
        price: 5.50,
        category: "fruits",
        stock: 30,
        image: "/images/blackbox/fraises.jpg",
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 jours
        region: "Bretagne",
        isActive: true
    },
    {
        name: "Courgettes Bio",
        description: "Courgettes vertes tendres, idéales pour les ratatouilles",
        price: 2.90,
        category: "légumes",
        stock: 60,
        image: "/images/blackbox/courgettes.jpg",
        expirationDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 jours
        region: "Occitanie",
        isActive: true
    },
    {
        name: "Bananes Bio",
        description: "Bananes mûres et délicieuses, source d'énergie naturelle",
        price: 3.20,
        category: "fruits",
        stock: 80,
        image: "/images/blackbox/bananes.jpg",
        expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
        region: "Martinique",
        isActive: true
    }
];

async function seedGreencardProducts() {
    console.log('🌱 Peuplement de la base de données greencard avec des produits...');

    try {
        // Connexion à MongoDB
        const mongoUri = 'mongodb+srv://modemodou0:hFlZ3Lrpv584eCVe@cluster0.vjyuysh.mongodb.net/greencart';
        await mongoose.connect(mongoUri);

        console.log('✅ Connecté à MongoDB - Base:', mongoose.connection.db.databaseName);

        // Trouver ou créer le producteur demo
        let demoProducer = await Producteur.findOne({ nom: 'Ferme Demo Bio' });
        if (!demoProducer) {
            console.log('Producteur demo non trouvé, création en cours...');
            // Créer un utilisateur d'abord
            const User = require('../models/User');
            const user = new User({
                username: 'producteur_demo',
                email: 'demo@greencard.local',
                password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password hashé pour "password"
                role: 'producteur'
            });
            const savedUser = await user.save();
            console.log('✅ Utilisateur demo créé:', savedUser.username);

            // Créer le producteur
            demoProducer = new Producteur({
                userId: savedUser._id,
                nom: 'Ferme Demo Bio',
                localisation: 'Bordeaux, France',
                produits: []
            });
            await demoProducer.save();
            console.log('✅ Producteur demo créé:', demoProducer.nom);
        } else {
            console.log('✅ Producteur demo trouvé:', demoProducer.nom);
        }

        // Ajouter producerId aux produits
        const productsWithProducer = demoProducts.map(product => ({
            ...product,
            producerId: demoProducer._id
        }));

        // Vider les produits existants
        await Product.deleteMany({});
        console.log('🗑️  Produits existants supprimés');

        // Insérer les produits de démonstration
        const insertedProducts = await Product.insertMany(productsWithProducer);
        console.log(`✅ ${insertedProducts.length} produits insérés avec succès`);

        // Afficher les produits créés
        console.log('\n📦 Produits créés:');
        insertedProducts.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name} - ${product.price}€ (${product.stock} en stock)`);
        });

        // Vérifier le total
        const totalProducts = await Product.countDocuments();
        console.log(`\n📊 Total des produits dans la base: ${totalProducts}`);

        await mongoose.connection.close();
        console.log('✅ Base de données greencard peuplée avec succès!');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

// Exécuter le script
seedGreencardProducts();
