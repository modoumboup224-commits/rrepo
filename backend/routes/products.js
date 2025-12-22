
import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import verifyToken from '../middleware/auth.js';


// GET /products - Get products with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, region, maxPrice, minPrice, expirationBefore, expirationAfter, producer, limit } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }
        if (region) {
            filter.region = region;
        }
        if (maxPrice || minPrice) {
            filter.price = {};
            if (maxPrice) filter.price.$lte = Number(maxPrice);
            if (minPrice) filter.price.$gte = Number(minPrice);
        }
        if (expirationBefore || expirationAfter) {
            filter.expirationDate = {};
            if (expirationBefore) filter.expirationDate.$lte = new Date(expirationBefore);
            if (expirationAfter) filter.expirationDate.$gte = new Date(expirationAfter);
        }
        if (producer) {
            filter.producerId = new mongoose.Types.ObjectId(producer);
        }

        let query = Product.find(filter);

        // Apply limit if specified
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const products = await query;
        console.log('Products found:', products);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /products - Publish a new product by producer
router.post('/', verifyToken, async (req, res) => {
    try {
        let producerId = req.user.id; // Assuming token contains producer id
        const { name, category, region, price, quantity, expirationDate, description, origin, impact } = req.body;

        if (!name || !category || !region || !price || !quantity || !expirationDate) {
            return res.status(400).json({ message: 'Champs requis manquants' });
        }

        // Convert producerId to ObjectId if it's a string
        if (typeof producerId === 'string') {
            try {
                const mongoose = require('mongoose');
                producerId = new mongoose.Types.ObjectId(producerId);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid producerId' });
            }
        }

        const newProduct = new Product({
            name,
            category,
            region,
            price,
            quantityAvailable: quantity,
            expirationDate,
            description,
            origin,
            impact,
            producerId
        });

        await newProduct.save();
        res.status(201).json({ message: 'Produit publié avec succès', product: newProduct });
    } catch (error) {
        console.error('Erreur publication produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// PUT /products/:id - Update a product by id
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        let producerId = req.user.id;

        // Convert producerId to ObjectId if it's a string
        if (typeof producerId === 'string') {
            const mongoose = require('mongoose');
            producerId = new mongoose.Types.ObjectId(producerId);
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        if (!product.producerId.equals(producerId)) {
            return res.status(403).json({ message: 'Accès refusé: non propriétaire du produit' });
        }

        const { name, category, region, price, quantity, expirationDate, description, origin, impact } = req.body;

        if (name !== undefined) product.name = name;
        if (category !== undefined) product.category = category;
        if (region !== undefined) product.region = region;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantityAvailable = quantity;
        if (expirationDate !== undefined) product.expirationDate = expirationDate;
        if (description !== undefined) product.description = description;
        if (origin !== undefined) product.origin = origin;
        if (impact !== undefined) product.impact = impact;

        await product.save();
        res.json({ message: 'Produit mis à jour avec succès', product });
    } catch (error) {
        console.error('Erreur mise à jour produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// GET /products/:id - Get a single product by id
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate ObjectId format
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'ID de produit invalide' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        res.json(product);
    } catch (error) {
        console.error('Erreur récupération produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// DELETE /products/:id - Delete a product by id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const productId = req.params.id;
        let producerId = req.user.id;

        // Convert producerId to ObjectId if it's a string
        if (typeof producerId === 'string') {
            const mongoose = require('mongoose');
            producerId = new mongoose.Types.ObjectId(producerId);
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        if (!product.producerId.equals(producerId)) {
            return res.status(403).json({ message: 'Accès refusé: non propriétaire du produit' });
        }

        await product.remove();
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;
