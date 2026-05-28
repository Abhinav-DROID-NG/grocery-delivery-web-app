// Global cart management
const CART_STORAGE_KEY = 'grocery_cart';
const API_BASE = '';

// Cart state
let cartItems = [];

// Initialize cart from localStorage
function initCart() {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    cartItems = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Add product to cart
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch(`${API_BASE}/api/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: parseInt(quantity)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to add to cart');
        }

        // Update local cart state
        const existingItem = cartItems.find(item => item.product_id === productId);
        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            cartItems.push({ product_id: productId, quantity: parseInt(quantity) });
        }
        saveCart();

        showAlert(`Product added to cart!`, 'success');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message, 'error');
        return false;
    }
}

// Remove product from cart
async function removeFromCart(cartId) {
    try {
        const response = await fetch(`${API_BASE}/api/cart/remove/${cartId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove from cart');
        }

        showAlert('Product removed from cart', 'success');
        return true;
    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message, 'error');
        return false;
    }
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
});
