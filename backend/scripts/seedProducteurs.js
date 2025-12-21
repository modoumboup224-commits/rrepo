require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Producteur = require('../models/Producteur');
const User = require('../models/User');

const producteursData = [
    {
        user: {
            username: 'ferme_bretagne',
            email: 'bretagne@greencard.local',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password hashé pour "password"
            role: 'producteur'
        },
        producteur: {
            nom: 'Ferme de Bretagne',
            localisation: 'Bretagne',
            produits: []
        }
    },
    {
        user: {
            username: 'jardins_sud',
            email: 'sud@greencard.local',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password hashé pour "password"
            role: 'producteur'
        },
        producteur: {
            nom: 'Les Jardins du Sud',
            localisation: 'Provence',
            produits: []
        }
    },
    {
        user: {
            username: 'verger_normand',
            email: 'normandie@greencard.local',
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password hashé pour "password"
            role: 'producteur'
        },
        producteur: {
            nom: 'Verger Normand',
            localisation: 'Normandie',
            produits: []
        }
    }
];

async function seed() {
    try {
        const mongoUri = 'mongodb+srv://modemodou0:hFlZ3Lrpv584eCVe@cluster0.vjyuysh.mongodb.net/greencart';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Supprimer les producteurs et utilisateurs existants
        await Producteur.deleteMany({});
        await User.deleteMany({ role: 'producteur' });
        console.log('Existing producteurs and producer users removed');

        // Créer les utilisateurs et producteurs
        for (const data of producteursData) {
            const savedUser = await User.create(data.user);
            console.log('✅ User created:', savedUser.username);

            const producteurData = {
                ...data.producteur,
                userId: savedUser._id
            };
            const savedProducteur = await Producteur.create(producteurData);
            console.log('✅ Producteur created:', savedProducteur.nom);
        }

        console.log('Sample producteurs and users inserted');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding producteurs:', error);
    }
}

seed();
