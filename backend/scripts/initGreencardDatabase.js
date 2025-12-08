#!/usr/bin/env node

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Modèles
const Product = require('../models/Product');
const User = require('../models/User');
const Producteur = require('../models/Producteur');
const Order = require('../models/Order');

// Données de démonstration complètes
const demoData = {
    users: [
        {
            username: "demo.consumer",
            email: "demo.consumer@greencard.local",
            password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
            role: "consommateur",
            address: "123 Rue de la Ferme, 75000 Paris"
        },
        {
            username: "demo.producteur",
            email: "demo.producteur@greencard.local",
            password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
            role: "producteur",
            farmName: "Ferme Bio Demo",
            address: "456 Route des Champs, 75000 Paris"
        }
    ],

    producteurs: [
        {
            name: "Ferme Bio Demo",
            email: "demo.producteur@greencard.local",
            phone: "0123456789",
            address: "456 Route des Champs, 75000 Paris",
            description: "Ferme biologique locale proposant des produits frais",
            products: [],
            rating: 4.8,
            totalSales: 150
        }
    ],

    products: [
        {
            name: "Tomates Bio",
            description: "Tomates rouges biologiques, cultivées sans pesticides",
            price: 3.50,
            category: "légumes",
            stock: 50,
            image: "/images/blackbox/tomates.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Carottes Bio",
            description: "Carottes fraîches et croquantes, cultivées localement",
            price: 2.80,
            category: "légumes",
            stock: 75,
            image: "/images/blackbox/carottes.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Pommes Bio",
            description: "Pommes rouges juteuses, récoltées à maturité",
            price: 4.20,
            category: "fruits",
            stock: 40,
            image: "/images/blackbox/pomme.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Fraises Bio",
            description: "Fraises fraîches et sucrées, parfaites pour les desserts",
            price: 5.50,
            category: "fruits",
            stock: 30,
            image: "/images/blackbox/fraises.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Courgettes Bio",
            description: "Courgettes vertes tendres, idéales pour les ratatouilles",
            price: 2.90,
            category: "légumes",
            stock: 60,
            image: "/images/blackbox/courgettes.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Bananes Bio",
            description: "Bananes mûres et délicieuses, source d'énergie naturelle",
            price: 3.20,
            category: "fruits",
            stock: 80,
            image: "/images/blackbox/bananes.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Poivrons Bio",
            description: "Poivrons rouges croquants, parfaits pour les salades",
            price: 4.50,
            category: "légumes",
            stock: 25,
            image: "/images/blackbox/poivrons.jpg",
            producerId: null,
            isActive: true
        },
        {
            name: "Cerises Bio",
            description: "Cerises sucrées et juteuses, de saison",
            price: 6.00,
            category: "fruits",
            stock: 20,
            image: "/images/blackbox/cerises.jpg",
            producerId: null,
            isActive: true
        }
    ]
};

async function initGreencardDatabase() {
    console.log('🚀 Initialisation complète de la base de données greencard...');
    console.log('=====================================================\n');

    try {
        // Connexion à MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greencard';
        await mongoose.connect(mongoUri);

        console.log('✅ Connecté à MongoDB - Base:', mongoose.connection.db.databaseName);

        // Vider toutes les collections existantes
        console.log('🗑️  Nettoyage des collections existantes...');
        await Product.deleteMany({});
        await User.deleteMany({});
        await Producteur.deleteMany({});
        await Order.deleteMany({});
        console.log('✅ Collections nettoyées');

        // Insérer les utilisateurs
        console.log('👥 Création des utilisateurs de démonstration...');
        const createdUsers = await User.insertMany(demoData.users);
        console.log(`✅ ${createdUsers.length} utilisateurs créés`);

        // Insérer les producteurs
        console.log('🏭 Création des producteurs...');
        const createdProducteurs = await Producteur.insertMany(demoData.producteurs);
        console.log(`✅ ${createdProducteurs.length} producteurs créés`);

        // Associer les producteurs aux produits
        console.log('🌱 Création des produits...');
        const productsWithProducer = demoData.products.map(product => ({
            ...product,
            producerId: createdProducteurs[0]._id
        }));

        const createdProducts = await Product.insertMany(productsWithProducer);
        console.log(`✅ ${createdProducts.length} produits créés`);

        // Mettre à jour le producteur avec ses produits
        await Producteur.findByIdAndUpdate(
            createdProducteurs[0]._id,
            { products: createdProducts.map(p => p._id) }
        );

        // Afficher le résumé
        console.log('\n📊 Résumé de la base de données greencard:');
        console.log('=====================================\n');

        const usersCount = await User.countDocuments();
        const producteursCount = await Producteur.countDocuments();
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments();

        console.log(`👥 Utilisateurs: ${usersCount}`);
        console.log(`🏭 Producteurs: ${producteursCount}`);
        console.log(`🌱 Produits: ${productsCount}`);
        console.log(`📦 Commandes: ${ordersCount}`);

        console.log('\n📦 Produits disponibles:');
        createdProducts.forEach((product, index) => {
            console
