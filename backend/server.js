import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import stripe from 'stripe';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);


console.log("Clé Stripe secrète utilisée :", process.env.STRIPE_SECRET_KEY);


const app = express();

// 🔥 CORS ICI ET NULLE PART AILLEURS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(express.json());

// Middleware temporaire pour lister les fichiers statiques accessibles
app.use((req, res, next) => {
    console.log('Requête statique pour :', req.url);
    next();
});

// Servir le dossier images statiques
app.use('/images', express.static(path.join(__dirname, '../images')))





const authRoutes = (await import('./routes/auth.js')).default // auth.js dans /routes
const authProducteurRoutes = (await import('./routes/auth-producteur.js')).default // Nouvelle route
const productRoutes = (await import('./routes/products.js')).default
const producteurRoutes = (await import('./routes/producteurs.js')).default
const paymentRoutes = (await import('./routes/payment.js')).default
const webhookRoutes = (await import('./routes/webhook.js')).default
const ordersRoutes = (await import('./routes/orders.js')).default
const dashboardRoutes = (await import('./routes/dashboard.js')).default

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
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/greencart';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB connected!");
    })
    .catch(err => {
        console.log("Erreur MongoDB :", err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

export { app };

// Optionally, you can add test user creation here if needed
