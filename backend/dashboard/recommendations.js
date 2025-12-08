const moment = require('moment');

// Mock sales data by season for products
const seasonalSales = {
    'Printemps': ['fraises', 'asperges', 'petits pois'],
    'Été': ['melons', 'tomates', 'aubergines'],
    'Automne': ['pommes', 'courges', 'poires'],
    'Hiver': ['agrumes', 'choux', 'poireaux']
};

// Basic function to get current season
function getCurrentSeason() {
    const month = moment().month() + 1; // month() is zero indexed
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
}

// Get sales recommendations based on season
function getSalesRecommendations() {
    const season = getCurrentSeason();
    const products = seasonalSales[season] || [];
    return {
        season,
        recommendations: products.map(p => `Augmenter les stocks de ${p}`)
    };
}

// Mock user segmentation clusters
const userSegments = [
    'Consommateurs réguliers',
    'Consommateurs occasionnels',
    'Producteurs partenaires'
];

// Get user segmentation recommendations
function getUserSegmentation() {
    return userSegments;
}

module.exports = {
    getSalesRecommendations,
    getUserSegmentation
};
