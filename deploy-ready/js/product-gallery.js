/**
 * Interactive Product Image Gallery
 * Uses the same images from product catalog for product details page
 */

class ProductGallery {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        this.images = images || [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        if (!this.container || this.images.length === 0) return;

        this.createGallery();
        this.bindEvents();
    }

    createGallery() {
        // Clear existing content
        this.container.innerHTML = '';

        // Create gallery structure
        const galleryHTML = `
            <div class="gallery-container">
                <div class="main-image-container">
                    <img id="main-gallery-image" 
                         src="${this.images[0]}" 
                         alt="Product image"
                         class="main-image">
                    <div class="image-nav">
                        <button class="nav-btn prev-btn" aria-label="Previous image">‹</button>
                        <button class="nav-btn next-btn" aria-label="Next image">›</button>
                    </div>
                </div>
                
                <div class="thumbnails-container">
                    ${this.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             data-index="${index}">
                            <img src="${img}" alt="Thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                
                <div class="image-counter">
                    <span id="current-image">1</span> / <span id="total-images">${this.images.length}</span>
                </div>
            </div>
        `;

        this.container.innerHTML = galleryHTML;
    }

    bindEvents() {
        // Thumbnail clicks
        this.container.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.setActiveImage(index);
            });
        });

        // Navigation buttons
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });
    }

    setActiveImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;

        // Update main image
        const mainImage = this.container.querySelector('#main-gallery-image');
        if (mainImage) {
            mainImage.src = this.images[index];
        }

        // Update thumbnails
        this.container.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        // Update counter
        const currentCounter = this.container.querySelector('#current-image');
        if (currentCounter) {
            currentCounter.textContent = index + 1;
        }
    }

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.setActiveImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.setActiveImage(prevIndex);
    }

    // Zoom functionality
    enableZoom() {
        const mainImage = this.container.querySelector('#main-gallery-image');
        if (mainImage) {
            mainImage.addEventListener('click', () => {
                this.openZoomModal();
            });
        }
    }

    openZoomModal() {
        const modal = document.createElement('div');
        modal.className = 'zoom-modal';
        modal.innerHTML = `
            <div class="zoom-modal-content">
                <span class="close-zoom">&times;</span>
                <img src="${this.images[this.currentIndex]}" alt="Zoomed product image">
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-zoom')) {
                document.body.removeChild(modal);
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // This will be called from product-details.html when product data is loaded
    window.initializeProductGallery = function (images) {
        const galleryContainer = document.getElementById('product-images-container');
        if (galleryContainer && images && images.length > 0) {
            new ProductGallery('product-images-container', images);
        }
    };
});
