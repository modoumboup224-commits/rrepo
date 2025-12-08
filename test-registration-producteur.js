// Test d'inscription producteur
const axios = require('axios');

const testData = {
    username: 'test-producteur-' + Date.now(),
    email: 'test-' + Date.now() + '@example.com',
    password: 'test123456',
    nom: 'Test Producteur',
    localisation: 'Paris, France'
};

async function testRegistration() {
    try {
        console.log('🧪 Test d\'inscription producteur...');

        const response = await axios.post('http://localhost:6300/api/auth/register-producteur', testData);

        console.log('✅ Inscription réussie !');
        console.log('User ID:', response.data.user.id);
        console.log('Producteur ID:', response.data.producteur.id);
        console.log('Token:', response.data.token);

        return true;
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.response?.data || error.message);
        return false;
    }
}

// Exécuter le test
if (require.main === module) {
    testRegistration();
}

module.exports = testRegistration;
