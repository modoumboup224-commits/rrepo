#!/usr/bin/env node

// Script principal pour configurer la demo complète
// Usage: node demoSetup.js

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Configuration de la demo GreenCard...');
console.log('=====================================\n');

// Fonction pour exécuter une commande
function runCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`📋 ${description}...`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Erreur: ${error}`);
                reject(error);
                return;
            }
            console.log(`✅ ${description} terminé`);
            if (stdout) console.log(stdout);
            resolve(stdout);
        });
    });
}

async function setupDemo() {
    try {
        // 1. Créer le producteur demo
        console.log('1️⃣ Création du producteur demo...');
        await runCommand('node backend/scripts/createDemoProducer.js', 'Création producteur');

        // 2. Créer des commandes fictives
        console.log('2️⃣ Création de commandes fictives...');
        await runCommand('node backend/scripts/createDemoOrder.js', 'Création commandes');

        // 3. Afficher les informations de connexion
        console.log('\n🎉 Demo configurée avec succès!');
        console.log('\n📊 Informations de connexion:');
        console.log('   Email: demo.producteur@greencard.local');
        console.log('   Mot de passe: password');
        console.log('\n🌐 URLs:');
        console.log('   - Inscription: http://localhost:6300/register-producer.html');
        console.log('   - Login: http://localhost:6300/login-updated.html');
        console.log('   - Dashboard: http://localhost:6300/dashboard.html');
        console.log('   - Gestion commandes: http://localhost:6300/producer-order-management.html');

        console.log('\n📝 Pour tester:');
        console.log('1. Démarrez le serveur: npm run dev');
        console.log('2. Connectez-vous avec les identifiants ci-dessus');
        console.log('3. Vérifiez le dashboard et l\'historique des commandes');

    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error);
    }
}

// Lancer la configuration
setupDemo();
