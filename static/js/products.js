let allProducts = [];

// Load products from backend
async function loadProducts() {
    try {
        const spinner = document.getElementById('loadingSpinner');
        const grid = document.getElementById('productsGrid');
        
        if (spinner) spinner.style.display = 'block';
        
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        allProducts = await response.json();
        
        if (spinner) spinner.style.display = 'none';
        
        displayProducts(allProducts);
        loadCategories();
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = '<p>Error loading products. Please refresh the page.</p>';
    }
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p>No products found</p>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${getProductEmoji(product.category)}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-stock">
                    Stock: ${product.stock > 0 ? product.stock : 'Out of Stock'}
                </div>
                <div class="product-actions">
                    <input type="number" min="1" max="${product.stock}" value="1" class="quantity-input" id="qty-${product.id}">
                    <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get emoji based on category
function getProductEmoji(category) {
    const emojiMap = {
        'Vegetables': '🥬',
        'Fruits': '🍎',
        'Dairy': '🥛',
        'Meat': '🍖',
        'Bakery': '🍞',
        'Beverages': '☕',
        'Snacks': '🍿',
        'Grains': '🌾',
        'Spices': '🌶️',
        'Frozen': '🧊'
    };
    return emojiMap[category] || '📦';
}

// Load unique categories
function loadCategories() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const categoryList = document.querySelector('.category-list');
    
    if (!categoryList) return;
    
    categoryList.innerHTML = `
        <button class="category-btn active" data-category="all">All Products</button>
        ${categories.map(cat => `
            <button class="category-btn" data-category="${cat}">${cat}</button>
        `).join('')}
    `;
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.dataset.category;
            filterByCategory(category);
        });
    });
}

// Filter products by category
function filterByCategory(category) {
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Handle add to cart click
function handleAddToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    addToCart(productId, quantity);
}

// Search products
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        );
        displayProducts(filtered);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupSearch();
});
