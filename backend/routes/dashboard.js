import express from 'express';
import verifyToken from '../middleware/auth.js';
const { getSalesRecommendations, getUserSegmentation } = await import('../dashboard/recommendations.js');


const router = express.Router();


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

export default router;

