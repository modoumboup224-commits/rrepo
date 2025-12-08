require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { app, getServer, closeServer } = require('../server'); // Use updated exports
const Product = require('../models/Product');

describe('API Products Endpoints', () => {
    let token;

    beforeAll(async () => {
        // Set MONGO_URI explicitly for tests
        process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/greencart_test';

        // Connect to test database only if not connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        // Generate a valid JWT token for authentication
        const payload = { id: new mongoose.Types.ObjectId().toHexString() };
        const secret = process.env.JWT_SECRET || 'secret123';
        token = jwt.sign(payload, secret, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await closeServer();
    });

    beforeEach(async () => {
        // Clear products collection before each test
        await Product.deleteMany({});
        // Insert sample products
        await Product.insertMany([
            {
                name: 'Test Apple',
                category: 'Fruits',
                region: 'Test Region',
                expirationDate: new Date('2025-12-31'),
                price: 1.5,
                description: 'Test description',
                origin: 'Test Origin',
                impact: 'Low',
                imageUrl: 'http://example.com/apple.jpg',
                producerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
            {
                name: 'Test Carrot',
                category: 'Légumes',
                region: 'Test Region',
                expirationDate: new Date('2025-11-30'),
                price: 0.8,
                description: 'Test description',
                origin: 'Test Origin',
                impact: 'Low',
                imageUrl: 'http://example.com/carrot.jpg',
                producerId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
        ]);
    });

    test('GET /api/products returns all products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(2);
    });

    test('GET /api/products with category filter', async () => {
        const res = await request(app).get('/api/products').query({ category: 'Fruits' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Apple');
    });

    test('GET /api/products with price filter', async () => {
        const res = await request(app).get('/api/products').query({ maxPrice: 1 });
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Carrot');
    });

    test('GET /api/products with expiration date filter', async () => {
        const res = await request(app).get('/api/products').query({ expirationBefore: '2025-12-01' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].name).toBe('Test Carrot');
    });

    // New tests for POST /api/products (product publication)
    describe('POST /api/products - publication de produit', () => {
        test('publier un produit avec succès', async () => {
            const newProduct = {
                name: 'Test Banana',
                category: 'Fruits',
                region: 'Test Region',
                price: 2.0,
                quantity: 10,
                expirationDate: '2025-10-10',
                description: 'Banana description',
                origin: 'Test Origin',
                impact: 'Low',
            };

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(newProduct);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Produit publié avec succès');
            expect(res.body.product).toMatchObject({
                name: newProduct.name,
                category: newProduct.category,
                region: newProduct.region,
                price: newProduct.price,
                quantityAvailable: newProduct.quantity,
                description: newProduct.description,
                origin: newProduct.origin,
                impact: newProduct.impact,
            });
        });

        test('échec de la publication - champs requis manquants', async () => {
            const incompleteProduct = {
                category: 'Fruits',
                region: 'Test Region',
                price: 2.0,
                quantity: 10,
                expirationDate: '2025-10-10',
            };

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(incompleteProduct);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Champs requis manquants');
        });
    });
});
