const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getSalesRecommendations, getUserSegmentation } = require('../dashboard/recommendations');

// Route to get sales recommendations
router.get('/sales-recommendations', verifyToken, (req, res) => {
    try {
        const recommendations = getSalesRecommendations();
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting sales recommendations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route to get user segmentation
router.get('/user-segmentation', verifyToken, (req, res) => {
    try {
        const segments = getUserSegmentation();
        res.json({ segments });
    } catch (error) {
        console.error('Error getting user segmentation:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route to get recommendations (ajoutée pour résoudre l'erreur 404)
router.get('/recommendations', verifyToken, (req, res) => {
    try {
        const recommendations = getSalesRecommendations();
        res.json(recommendations);
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
