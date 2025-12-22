import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Producteur from '../models/Producteur.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; // Met une vraie clé dans ton .env

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /api/auth/test:
 *   get:
 *     summary: Test route
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Route is functional
 */
router.get('/test', (req, res) => {
    res.json({ message: "✅ Route /api/test fonctionnelle" });
});

// Enregistrement
router.post('/register', async (req, res) => {
    console.log('✅ Données reçues pour register :', req.body);
    const { username, email, password, role } = req.body;

    try {
        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '❌ Utilisateur déjà existant' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création du nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // Génère un token JWT (optionnel)
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: '✅ Utilisateur enregistré', token });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '❌ Identifiants invalides' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: '❌ Identifiants invalides' });
        }

        // Génère un token JWT
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: '✅ Connexion réussie',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;
