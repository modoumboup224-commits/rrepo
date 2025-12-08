const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Route de test améliorée
router.get('/test', (req, res) => {
    res.json({
        message: "✅ Route /api/test fonctionnelle",
        timestamp: new Date().toISOString(),
        env: {
            jwtSecret: JWT_SECRET !== 'secret123',
            port: process.env.PORT || 6300
        }
    });
});

// Route de vérification de la base de données
router.get('/db-status', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        res.json({
            status: states[dbState],
            readyState: dbState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur lors de la vérification de la base de données',
            details: error.message
        });
    }
});

// Route de connexion avec logs détaillés
router.post('/login-debug', async (req, res) => {
    console.log('\n=== DEBUT LOGIN DEBUG ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: 'Champs requis manquants',
            required: ['email', 'password'],
            received: Object.keys(req.body)
        });
    }

    try {
        console.log('🔍 Recherche utilisateur:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            return res.status(404).json({
                error: 'Utilisateur non trouvé',
                email: email
            });
        }

        console.log('✅ Utilisateur trouvé:', user.username);
        console.log('🔍 Vérification mot de passe...');

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            console.log('❌ Mot de passe incorrect');
            return res.status(401).json({
                error: 'Mot de passe incorrect'
            });
        }

        console.log('✅ Mot de passe valide');
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '1h' });

        console.log('✅ Token généré');

        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('=== ERREUR DETAILLEE ===');
        console.error('Nom:', error.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);

        res.status(500).json({
            error: 'Erreur serveur',
            type: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Route de test avec données mock
router.post('/login-test', async (req, res) => {
    const testUser = {
        email: 'test@example.com',
        password: 'test123'
    };

    try {
        // Créer un utilisateur de test si nécessaire
        let user = await User.findOne({ email: testUser.email });

        if (!user) {
            const hashedPassword = await bcrypt.hash(testUser.password, 10);
            user = new User({
                username: 'testuser',
                email: testUser.email,
                password: hashedPassword,
                role: 'consommateur'
            });
            await user.save();
            console.log('✅ Utilisateur de test créé');
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            message: 'Test réussi',
            token,
            testUser: {
                email: testUser.email,
                password: testUser.password
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'Erreur test',
            details: error.message
        });
    }
});

module.exports = router;
