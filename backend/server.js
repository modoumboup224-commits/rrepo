'use strict'

/*eslint-env node,es6*/

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


console.log("Clé Stripe secrète utilisée :", process.env.STRIPE_SECRET_KEY);


const app = express()
const PORT = process.env.PORT || 6300

console.log("MONGO_URI:", process.env.MONGO_URI)  // Log MONGO_URI to verify dotenv loading
console.log("Server will listen on port:", PORT);  // Debug log for port

// Middlewares
app.use(cors({
    origin: ["https://resilient-greencard.netlify.app"], // Domaine Netlify exact
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware temporaire pour lister les fichiers statiques accessibles
app.use((req, res, next) => {
    console.log('Requête statique pour :', req.url);
    next();
});

// Servir le dossier images statiques
app.use('/images', express.static(path.join(__dirname, '../images')))

// Servir le dossier frontend statique
app.use(express.static(path.join(__dirname, '../frontend')))

// Import de la page d'accueil HTML
const genererPageAccueil = require('./server-get.js')

const authRoutes = require('./routes/auth') // auth.js dans /routes
const authProducteurRoutes = require('./routes/auth-producteur') // Nouvelle route
const productRoutes = require('./routes/products')
const producteurRoutes = require('./routes/producteurs')
const paymentRoutes = require('./routes/payment')
const webhookRoutes = require('./routes/webhook')
const ordersRoutes = require('./routes/orders')
const dashboardRoutes = require('./routes/dashboard')

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GreenCard API',
            version: '1.0.0',
            description: 'API pour la plateforme GreenCard - Circuit court et anti-gaspi',
            contact: {
                name: 'GreenCard Team',
                email: 'contact@greencard.fr'
            }
        },
        servers: [
            {
                url: 'http://localhost:6300',
                description: 'Serveur de développement'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.get('/', async (req, res) => {
    const indexHtml = await genererPageAccueil()
    res.send(indexHtml)
})

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes)
app.use('/api/auth', authProducteurRoutes)
app.use('/api/products', productRoutes)
app.use('/api/producteurs', producteurRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/webhook', webhookRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Connexion DB
let server;

async function startServer() {
    // Utiliser la base de données définie dans MONGO_URI
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/greencart';

    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log("MongoDB connected!");
            server = app.listen(PORT, () => {
                console.log(`🚀 Serveur démarré : http://localhost:${PORT}`);
            });
        })
        .catch(err => {
            console.log("Erreur MongoDB :", err);
        });
}

startServer();

module.exports = {
    app,
    getServer: () => server,
    closeServer: async () => {
        if (server) {
            await mongoose.connection.close();
            server.close();
        }
    }
};

const User = require('./models/User')

async function testCreationUtilisateur() {
    const user = new User({
        username: 'testuser',
        email: 'test@test.com',
        password: 'passwordhashéplus-tard',
        role: 'consommateur'
    })

    try {
        await user.save()
        console.log('✅ Utilisateur de test créé')
    } catch (err) {
        console.error('❌ Erreur création user :', err.message)
    }
}

// Optionally call the test function here to create the test user on server start
// testCreationUtilisateur()
