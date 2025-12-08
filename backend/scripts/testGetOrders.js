const axios = require('axios');

async function testGetOrders() {
    try {
        const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with a valid JWT token for authentication

        const response = await axios.get('http://localhost:3000/api/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Orders retrieved:', response.data);
    } catch (error) {
        console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    }
}

testGetOrders();
