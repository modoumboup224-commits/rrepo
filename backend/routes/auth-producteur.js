import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Producteur from '../models/Producteur.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * @swagger
 * tags:
 *   name: Auth Producteur
 *   description: Routes d'inscription spécifiques aux producteurs
 */

/**
 * @swagger
 * /api/auth/register-producteur:
 *   post:
 *     summary: Inscription d'un producteur
 *     tags: [Auth Producteur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - nom
 *               - localisation
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nom:
 *                 type: string
 *               localisation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producteur enregistré avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/register-producteur', async (req, res) => {
    console.log('✅ Données reçues pour register-producteur :', req.body);
    const { username, email, password, nom, localisation } = req.body;

    try {
        // Vérifications de base
        if (!username || !email || !password || !nom || !localisation) {
            return res.status(400).json({
                message: '❌ Tous les champs sont requis'
            });
        }

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: existingUser.username === username
                    ? '❌ Nom d\'utilisateur déjà existant'
                    : '❌ Email déjà existant'
            });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création du nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'producteur'
        });

        await newUser.save();

        // Création automatique du producteur associé
        const newProducteur = new Producteur({
            userId: newUser._id,
            nom,
            localisation,
            isProfileComplete: true
        });

        await newProducteur.save();

        // Génère un token JWT
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: '✅ Producteur enregistré avec succès',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            producteur: {
                id: newProducteur._id,
                nom: newProducteur.nom,
                localisation: newProducteur.localisation
            }
        });

    } catch (err) {
        console.error('Erreur lors de l\'enregistrement:', err);

        // Gestion d'erreurs spécifiques
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            return res.status(400).json({
                message: `❌ ${field} déjà existant`
            });
        }

        res.status(500).json({
            message: '❌ Erreur serveur lors de l\'inscription'
        });
    }
});

export default router;
