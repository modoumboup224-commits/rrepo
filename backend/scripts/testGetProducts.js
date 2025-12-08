const fetch = require('node-fetch');

async function testGetProducts() {
    try {
        const response = await fetch('http://localhost:6300/api/products');
        const products = await response.json();
        console.log('Products from API:', products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

testGetProducts();
