const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const verifyToken = require('../middleware/auth');

// Route pour récupérer l'historique des commandes de l'utilisateur connecté
router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('User ID from token:', req.user.id);
        // Return orders filtered by userId
        const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Erreur récupération commandes :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour mettre à jour le commentaire d'une commande
router.put('/:orderId/comment', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { comment } = req.body;

        // Vérifier que la commande appartient à l'utilisateur
        const order = await Order.findOne({ _id: orderId, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Mettre à jour le commentaire
        order.comment = comment;
        await order.save();

        res.json({ message: 'Commentaire mis à jour avec succès', order });
    } catch (error) {
        console.error('Erreur mise à jour commentaire :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour récupérer les commandes liées aux produits du producteur connecté
router.get('/producer', verifyToken, async (req, res) => {
    try {
        const producerId = req.user.id;

        // Trouver les produits du producteur
        const products = await Product.find({ producerId }).select('_id');
        const productIds = products.map(p => p._id);

        // Trouver les commandes contenant ces produits
        const orders = await Order.find({ 'products.productId': { $in: productIds } }).sort({ date: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Erreur récupération commandes producteur :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route pour mettre à jour le statut d'une commande (par producteur)
router.put('/:orderId/status', verifyToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const producerId = req.user.id;

        // Vérifier que la commande contient un produit du producteur
        const products = await Product.find({ producerId }).select('_id');
        const productIds = products.map(p => p._id);

        const order = await Order.findOne({ _id: orderId, 'products.productId': { $in: productIds } });
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée pour ce producteur' });
        }

        // Mettre à jour le statut
        order.status = status;
        await order.save();

        res.json({ message: 'Statut de la commande mis à jour avec succès', order });
    } catch (error) {
        console.error('Erreur mise à jour statut commande :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
