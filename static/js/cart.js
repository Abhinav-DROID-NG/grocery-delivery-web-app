// Load and display cart
async function loadCart() {
    try {
        const response = await fetch('/cart');
        const html = await response.text();
        
        // Parse the cart data from backend
        // Since we're using client-side cart, we'll fetch products and show cart items
        loadCartDisplay();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Display cart items
async function loadCartDisplay() {
    try {
        // Get all products
        const productsResponse = await fetch('/api/products');
        const products = await productsResponse.json();
        
        // Map product IDs to product details
        const productMap = {};
        products.forEach(p => productMap[p.id] = p);
        
        const emptyCart = document.getElementById('emptyCart');
        const cartTable = document.getElementById('cartTable');
        const cartBody = document.getElementById('cartBody');
        const cartSummary = document.getElementById('cartSummary');
        
        if (!cartItems || cartItems.length === 0) {
            emptyCart.style.display = 'block';
            if (cartTable) cartTable.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }
        
        emptyCart.style.display = 'none';
        if (cartTable) cartTable.style.display = 'table';
        if (cartSummary) cartSummary.style.display = 'block';
        
        let subtotal = 0;
        let html = '';
        
        cartItems.forEach((item, index) => {
            const product = productMap[item.product_id];
            if (!product) return;
            
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <tr>
                    <td>${product.name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${index}, -1)">−</button>
                            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantityInput(${index}, this.value)">
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td>${formatCurrency(itemTotal)}</td>
                    <td>
                        <button class="btn btn-danger" onclick="removeCartItem(${index})">Remove</button>
                    </td>
                </tr>
            `;
        });
        
        cartBody.innerHTML = html;
        
        // Update summary
        const delivery = 50;
        const total = subtotal + delivery;
        
        document.getElementById('subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('totalAmount').textContent = formatCurrency(total);
        
    } catch (error) {
        console.error('Error loading cart display:', error);
        showAlert('Error loading cart', 'error');
    }
}

// Update quantity by increment/decrement
function updateQuantity(index, change) {
    if (cartItems[index]) {
        cartItems[index].quantity += change;
        if (cartItems[index].quantity < 1) {
            cartItems.splice(index, 1);
        }
        saveCart();
        loadCartDisplay();
    }
}

// Update quantity from input
function updateQuantityInput(index, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) {
        removeCartItem(index);
        return;
    }
    if (cartItems[index]) {
        cartItems[index].quantity = newQuantity;
        saveCart();
        loadCartDisplay();
    }
}

// Remove item from cart
function removeCartItem(index) {
    if (cartItems[index]) {
        cartItems.splice(index, 1);
        saveCart();
        loadCartDisplay();
        showAlert('Product removed from cart', 'success');
    }
}

// Handle checkout
async function handleCheckout() {
    try {
        const customerName = document.getElementById('customerName')?.value;
        const customerEmail = document.getElementById('customerEmail')?.value;
        const customerPhone = document.getElementById('customerPhone')?.value;
        const deliveryAddress = document.getElementById('deliveryAddress')?.value;
        
        if (!customerName || !customerEmail || !customerPhone || !deliveryAddress) {
            showAlert('Please fill in all delivery details', 'error');
            return;
        }
        
        if (cartItems.length === 0) {
            showAlert('Your cart is empty', 'error');
            return;
        }
        
        // Disable checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Processing...';
        
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                delivery_address: deliveryAddress
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Checkout failed');
        }
        
        // Clear cart
        cartItems = [];
        saveCart();
        
        showAlert(`Order placed successfully! Order ID: ${data.order_id}`, 'success');
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        showAlert(error.message, 'error');
        
        // Re-enable checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Place Order';
    }
}

// Setup checkout button listener
document.addEventListener('DOMContentLoaded', () => {
    loadCartDisplay();
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});
