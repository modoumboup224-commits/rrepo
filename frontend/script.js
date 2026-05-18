// Source of truth pour l’API
if (!window.__GREENCARD_API_BASE_URL) {
    window.__GREENCARD_API_BASE_URL = 'https://rrrrepo.onrender.com';
}

// Éviter l’erreur: “Identifier 'API_BASE_URL' has already been declared” si script.js est chargé 2 fois.
// (Utiliser une variable globale plutôt que const locale.)
if (!window.__GREENCARD_API_BASE_URL_LOCAL) {
    window.__GREENCARD_API_BASE_URL_LOCAL = window.__GREENCARD_API_BASE_URL;
}

// Ne pas déclarer de variable locale `API_BASE_URL`.
// On lit directement la base URL depuis le scope global à chaque usage.



// Protéger contre un chargement multiple du script.js
if (window.__GREENCARD_HOME_RENDER_READY__) {
    // Ne pas ré-exécuter la logique
} else {
    window.__GREENCARD_HOME_RENDER_READY__ = true;


    async function fetchProducts(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const qs = queryParams.toString();
        const url = `${API_BASE_URL}/api/products?${qs}`;
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`[script.js] fetchProducts failed: ${response.status} ${response.statusText}. Body: ${text.slice(0, 200)}`);
        }
        return response.json();
    }

    function renderProducts(products) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        if (products.length === 0) {
            productList.innerHTML = '<p>Aucun produit trouvé.</p>';
            return;
        }
        products.forEach(product => {
            console.log('Image URL:', product.imageUrl);
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            const randomStock = typeof product.quantityAvailable === 'number' ? product.quantityAvailable : (Math.floor(Math.random() * 20) + 1);
            productDiv.innerHTML = `
            <a href="product-details.html?id=${product._id}" style="text-decoration: none; color: inherit;">
                <h3>${product.name}</h3>
                <img src="${product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : API_BASE_URL + (product.imageUrl || '/images/default-product.jpg')}" alt="${product.name}" style="max-width: 200px; max-height: 200px; object-fit: cover; margin-bottom: 10px;" />
                <p>Catégorie: ${product.category}</p>
                <p>Région: ${product.region}</p>
                <p>Prix: €${product.price.toFixed(2)}</p>
                <p>Stock : ${randomStock}</p>
                <p>Date limite: ${new Date(product.expirationDate).toLocaleDateString()}</p>
                <p>Description: ${product.description || 'N/A'}</p>
                <p>Origine: ${product.origin || 'N/A'}</p>
                <p>Impact: ${product.impact || 'N/A'}</p>
            </a>

            <div class="qty-picker" style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                <button type="button" onclick="changeQty('${product._id}', -1)" style="padding: 6px 10px;">[-]</button>
                <div>
                    <div style="font-weight:700;">Quantité</div>
                    <div style="text-align:center; font-weight:800;"> <span id="qty-${product._id}">1</span></div>
                    <div style="font-size:12px; opacity:0.9;">Disponible: ${randomStock}</div>
                </div>
                <button type="button" onclick="changeQty('${product._id}', 1)" style="padding: 6px 10px;">[+]</button>
            </div>

            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, ${randomStock})" style="margin-top:10px;">Ajouter au panier</button>
        `;
            productList.appendChild(productDiv);
        });
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(id, name, price, stock) {
        const safeStock = typeof stock === 'number' && stock > 0 ? stock : Infinity;
        const qtyText = document.getElementById(`qty-${id}`);
        const selectedQty = qtyText ? parseInt(qtyText.textContent, 10) : 1;
        const quantity = Math.max(1, Math.min(selectedQty, safeStock));

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity = existingItem.quantity + quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }

        saveCart();
        alert(name + ' a été ajouté au panier.');
    }

    function changeQty(id, delta) {
        const qtyEl = document.getElementById(`qty-${id}`);
        if (!qtyEl) return;

        const current = parseInt(qtyEl.textContent, 10) || 1;
        const next = Math.max(1, current + delta);
        qtyEl.textContent = String(next);
    }


    async function fetchProducteurs() {
        const response = await fetch(`${API_BASE_URL}/api/producteurs`);
        const producteurs = await response.json();
        return producteurs;
    }

    function renderProducteurs(producteurs) {
        const producteurList = document.getElementById('producteurList');
        producteurList.innerHTML = '';
        if (producteurs.length === 0) {
            producteurList.innerHTML = '<p>Aucun producteur trouvé.</p>';
            return;
        }
        producteurs.forEach(producteur => {
            const producteurDiv = document.createElement('div');
            producteurDiv.className = 'product-item';

            // Utiliser l'URL de la photo du producteur si elle existe, sinon image par défaut
            const imageUrl = producteur.photoUrl || `${API_BASE_URL}/images/default-producer.jpg`;

            producteurDiv.innerHTML = `
            <a href="producer-details.html?id=${producteur._id}" style="text-decoration: none; color: inherit;">
                <h3>${producteur.nom}</h3>
                <img src="${imageUrl}" alt="${producteur.nom}" style="max-width: 200px; max-height: 200px; object-fit: cover; margin-bottom: 10px;" onerror="this.src='${API_BASE_URL}/images/default-producer.jpg'" />
                <p>Localisation: ${producteur.localisation}</p>
            </a>
        `;
            producteurList.appendChild(producteurDiv);
        });
    }

    async function applyFilters() {
        const category = document.getElementById('categoryFilter').value;
        const region = document.getElementById('regionFilter').value;
        const maxPrice = document.getElementById('priceFilter').value;
        const expirationBefore = document.getElementById('expirationFilter').value;

        const filters = {};
        if (category) filters.category = category;
        if (region) filters.region = region;
        if (maxPrice) filters.maxPrice = maxPrice;
        if (expirationBefore) filters.expirationBefore = expirationBefore;

        const products = await fetchProducts(filters);
        renderProducts(products);

        const producteurs = await fetchProducteurs();
        renderProducteurs(producteurs);
    }

    document.getElementById('applyFilters').addEventListener('click', applyFilters);

    // Initial load (robuste)
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const btn = document.getElementById('applyFilters');
            const list = document.getElementById('productList');
            if (!btn) console.warn('[script.js] #applyFilters introuvable');
            if (!list) console.warn('[script.js] #productList introuvable');
            applyFilters();
        } catch (e) {
            console.error('[script.js] erreur init applyFilters:', e);
            const list = document.getElementById('productList');
            if (list) list.innerHTML = `<p style="color:red">Erreur chargement produits: ${e.message}</p>`;
        }
    });

} // <-- ferme else { ... }
