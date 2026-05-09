// Configuration pour l'API
// Utiliser la même origine que le site courant pour éviter les décalages (port/domaine).
const API_BASE_URL = window.location.origin;

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const products = await response.json();
        console.log(products); // Vérifie que ça renvoie bien les produits

        // Exemple simple pour afficher dans le HTML
        const container = document.getElementById("products-container");
        products.forEach(product => {
            const div = document.createElement("div");
            div.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.price} €</p>
      `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error("Erreur fetch produits :", error);
    }
}

// Appeler la fonction après le chargement du DOM
window.addEventListener('DOMContentLoaded', loadProducts);
