const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkAndFixDatabase() {
    console.log('🔍 Vérification de la configuration MongoDB...');

    // Connexion à la base de données actuelle
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greencart');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('📊 Base de données actuelle:', db.databaseName);
        console.log('📋 Collections trouvées:', collections.map(c => c.name));

        // Vérifier si c'est la bonne base de données
        const expectedDbName = 'greencart';
        const currentDbName = db.databaseName;

        if (currentDbName !== expectedDbName) {
            console.log(`⚠️  Attention: Vous utilisez "${currentDbName}" au lieu de "${expectedDbName}"`);
            console.log('💡 Solution: Modifiez MONGO_URI dans votre fichier .env');
        } else {
            console.log('✅ Vous utilisez la bonne base de données');
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Erreur de connexion:', error);
    }
}

// Fonction pour créer un script de nettoyage
async function createCleanupScript() {
    console.log('🧹 Création du script de nettoyage...');

    const cleanupScript = `
# Script de nettoyage MongoDB
# Sauvegarder les données avant nettoyage

echo "📦 Sauvegarde des bases de données..."
mongodump --host localhost --port 27017 --db greencart --out ./backup_$(date +%Y%m%d_%H%M%S)
mongodump --host localhost --port 27017 --db greencard --out ./backup_$(date +%Y%m%d_%H%M%S)

echo "✅ Sauvegardes créées dans ./backup_$(date +%Y%m%d_%H%M%S)/"
echo "📊 Vérification des bases de données..."
mongo --eval "printjson(db.adminCommand('listDatabases'))"
    `;

    console.log('📄 Script de sauvegarde créé');
    console.log('Pour l\'utiliser:');
    console.log('1. Sauvegarder: bash cleanup.sh');
    console.log('2. Vérifier: mongo --eval "use greencart; show collections"');
}

// Exécuter la vérification
checkAndFixDatabase();
createCleanupScript();
