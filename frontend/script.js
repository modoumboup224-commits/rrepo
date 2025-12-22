const API_BASE_URL = "https://rrrrepo.onrender.com";
async function fetchProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/products?` + queryParams.toString());
    const products = await response.json();
    return products;
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
        productDiv.innerHTML = `
            <a href="product-details.html?id=${product._id}" style="text-decoration: none; color: inherit;">
                <h3>${product.name}</h3>
                <img src="${product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : API_BASE_URL + (product.imageUrl || '/images/default-product.jpg')}" alt="${product.name}" style="max-width: 200px; max-height: 200px; object-fit: cover; margin-bottom: 10px;" />
                <p>Catégorie: ${product.category}</p>
                <p>Région: ${product.region}</p>
                <p>Prix: €${product.price.toFixed(2)}</p>
                <p>Date limite: ${new Date(product.expirationDate).toLocaleDateString()}</p>
                <p>Description: ${product.description || 'N/A'}</p>
                <p>Origine: ${product.origin || 'N/A'}</p>
                <p>Impact: ${product.impact || 'N/A'}</p>
            </a>
            <button onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Ajouter au panier</button>
        `;
        productList.appendChild(productDiv);
    });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    alert(name + ' a été ajouté au panier.');
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

// Initial load
applyFilters();
