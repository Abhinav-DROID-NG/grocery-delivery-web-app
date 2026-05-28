/* ============================================================
   FreshMart — Main JavaScript
   Cart management, UI interactions, toast notifications
   ============================================================ */

'use strict';

/* ── Cart State ── */
const Cart = (() => {
  const STORAGE_KEY = 'freshmart_cart';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getItems() { return load(); }

  function getCount() { return load().reduce((n, i) => n + i.qty, 0); }

  function getTotal() { return load().reduce((t, i) => t + i.price * i.qty, 0); }

  function addItem(product) {
    const items = load();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...product, qty: 1 });
    }
    save(items);
    updateCartUI();
    return items;
  }

  function removeItem(id) {
    save(load().filter(i => i.id !== id));
    updateCartUI();
  }

  function updateQty(id, qty) {
    if (qty < 1) { removeItem(id); return; }
    const items = load();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; save(items); }
    updateCartUI();
  }

  function clear() { save([]); updateCartUI(); }

  function updateCartUI() {
    const count = getCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-block' : 'none';
    });
    // Dispatch event for cart page to re-render
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count, total: getTotal() } }));
  }

  return { getItems, getCount, getTotal, addItem, removeItem, updateQty, clear, updateCartUI };
})();

/* ── Toast Notifications ── */
const Toast = (() => {
  let container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'default', duration = 2800) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    getContainer().appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('show'));
    });

    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, duration);
  }

  return {
    success: (msg) => show('✓ ' + msg, 'success'),
    error:   (msg) => show('✗ ' + msg, 'error'),
    info:    (msg) => show(msg, 'default'),
  };
})();

/* ── Product Data ── */
const PRODUCTS = [
  { id: 1,  name: 'Fresh Broccoli',    emoji: '🥦', weight: '500 g',  price: 49,  category: 'vegetables' },
  { id: 2,  name: 'Shimla Apples',     emoji: '🍎', weight: '1 kg',   price: 149, category: 'fruits' },
  { id: 3,  name: 'Full Cream Milk',   emoji: '🥛', weight: '1 L',    price: 65,  category: 'dairy' },
  { id: 4,  name: 'Brown Onions',      emoji: '🧅', weight: '1 kg',   price: 39,  category: 'vegetables' },
  { id: 5,  name: 'Lemon',             emoji: '🍋', weight: '6 pcs',  price: 29,  category: 'fruits' },
  { id: 6,  name: 'Farm Eggs',         emoji: '🥚', weight: '12 pcs', price: 89,  category: 'dairy' },
  { id: 7,  name: 'Amul Cheese',       emoji: '🧀', weight: '200 g',  price: 119, category: 'dairy' },
  { id: 8,  name: 'Bananas',           emoji: '🍌', weight: '6 pcs',  price: 35,  category: 'fruits' },
  { id: 9,  name: 'Sunflower Oil',     emoji: '🫚', weight: '1 L',    price: 145, category: 'pantry' },
  { id: 10, name: 'Tomatoes',          emoji: '🍅', weight: '500 g',  price: 28,  category: 'vegetables' },
  { id: 11, name: 'Capsicum Mix',      emoji: '🫑', weight: '250 g',  price: 55,  category: 'vegetables' },
  { id: 12, name: 'Whole Wheat Bread', emoji: '🍞', weight: '400 g',  price: 55,  category: 'bakery' },
  { id: 13, name: 'Greek Yogurt',      emoji: '🥣', weight: '200 g',  price: 79,  category: 'dairy' },
  { id: 14, name: 'Mango',             emoji: '🥭', weight: '2 pcs',  price: 89,  category: 'fruits' },
  { id: 15, name: 'Spinach',           emoji: '🥬', weight: '250 g',  price: 35,  category: 'vegetables' },
  { id: 16, name: 'Orange Juice',      emoji: '🧃', weight: '1 L',    price: 99,  category: 'drinks' },
  { id: 17, name: 'Butter',            emoji: '🧈', weight: '100 g',  price: 55,  category: 'dairy' },
  { id: 18, name: 'Potato Chips',      emoji: '🥔', weight: '150 g',  price: 45,  category: 'snacks' },
];

/* ── Product Card Builder ── */
function buildProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card animate-in';
  card.dataset.id = product.id;
  card.innerHTML = `
    <div class="product-img">${product.emoji}</div>
    <div class="product-info">
      <div class="product-name">${product.name}</div>
      <div class="product-weight">${product.weight}</div>
      <div class="product-footer">
        <span class="product-price">₹${product.price}</span>
        <button class="add-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">+</button>
      </div>
    </div>`;
  return card;
}

/* ── Render Product Grid ── */
function renderProducts(container, filter = 'all') {
  if (!container) return;
  container.innerHTML = '';
  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  filtered.forEach((p, i) => {
    const card = buildProductCard(p);
    card.style.animationDelay = `${i * 0.04}s`;
    container.appendChild(card);
  });

  // Bind add buttons
  container.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        Cart.addItem(product);
        Toast.success(`${product.name} added to cart`);
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 600);
      }
    });
  });
}

/* ── Category Filter ── */
function initCategoryFilter() {
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.category || 'all';
      const grid = document.querySelector('.product-grid');
      renderProducts(grid, cat);
    });
  });

  document.querySelectorAll('.filter-chip:not(.sort)').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip:not(.sort)').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.category || 'all';
      const grid = document.querySelector('.product-grid');
      renderProducts(grid, cat);
    });
  });
}

/* ── Cart Page Renderer ── */
function renderCartPage() {
  const itemsEl = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('order-summary');
  if (!itemsEl) return;

  const items = Cart.getItems();

  if (items.length === 0) {
    itemsEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  itemsEl.style.display = 'flex';
  if (summaryEl) summaryEl.style.display = 'block';

  itemsEl.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item animate-in';
    el.innerHTML = `
      <div class="ci-img">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-weight">${item.weight}</div>
        <div class="qty-ctrl">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="ci-right">
        <span class="ci-price">₹${item.price * item.qty}</span>
        <button class="ci-remove" data-id="${item.id}">Remove</button>
      </div>`;
    itemsEl.appendChild(el);
  });

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      const item = Cart.getItems().find(i => i.id === id);
      if (item) Cart.updateQty(id, item.qty + (action === 'inc' ? 1 : -1));
      renderCartPage();
      updateOrderSummary();
    });
  });

  itemsEl.querySelectorAll('.ci-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.removeItem(parseInt(btn.dataset.id));
      renderCartPage();
      updateOrderSummary();
    });
  });

  updateOrderSummary();
}

/* ── Order Summary Calc ── */
function updateOrderSummary() {
  const subtotalEl = document.getElementById('os-subtotal');
  const savingsEl  = document.getElementById('os-savings');
  const deliveryEl = document.getElementById('os-delivery');
  const totalEl    = document.getElementById('os-total');
  const itemCountEl = document.getElementById('cart-item-count');

  const items    = Cart.getItems();
  const subtotal = Cart.getTotal();
  const discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const delivery = subtotal > 299 ? 0 : 25;
  const total    = subtotal - discount + delivery;

  if (subtotalEl)  subtotalEl.textContent  = `₹${subtotal}`;
  if (savingsEl)   { savingsEl.textContent = discount > 0 ? `−₹${discount}` : '—'; savingsEl.parentElement.style.display = discount > 0 ? 'flex' : 'none'; }
  if (deliveryEl)  deliveryEl.textContent  = delivery === 0 ? 'FREE' : `₹${delivery}`;
  if (totalEl)     totalEl.textContent     = `₹${total}`;
  if (itemCountEl) itemCountEl.textContent = `${items.reduce((n,i) => n+i.qty,0)} item${items.length !== 1 ? 's' : ''}`;
}

let promoApplied = false;

/* ── Promo Code ── */
function initPromoCode() {
  const btn = document.getElementById('promo-apply');
  const input = document.getElementById('promo-input');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (code === 'FRESH20') {
      promoApplied = true;
      Toast.success('Promo FRESH20 applied! 20% off');
      input.disabled = true;
      btn.textContent = '✓ Applied';
      btn.style.background = 'var(--green)';
      btn.style.color = '#fff';
      updateOrderSummary();
    } else {
      Toast.error('Invalid promo code');
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => input.style.borderColor = '', 2000);
    }
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
}

/* ── Checkout ── */
function initCheckout() {
  const btn = document.getElementById('checkout-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (Cart.getCount() === 0) { Toast.error('Your cart is empty'); return; }
    Toast.success('Order placed! Delivering in 30 min 🚀');
    setTimeout(() => { Cart.clear(); renderCartPage(); }, 1000);
  });
}

/* ── Auth Forms ── */
function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.querySelector('[name="email"]').value;
      const pass  = loginForm.querySelector('[name="password"]').value;
      if (!email || !pass) { Toast.error('Please fill in all fields'); return; }
      Toast.success('Welcome back! Redirecting…');
      setTimeout(() => window.location.href = 'index.html', 1500);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const pass  = registerForm.querySelector('[name="password"]').value;
      const pass2 = registerForm.querySelector('[name="confirm_password"]');
      if (pass2 && pass !== pass2.value) { Toast.error('Passwords do not match'); return; }
      Toast.success('Account created! Please sign in');
      setTimeout(() => window.location.href = 'login.html', 1500);
    });
  }
}

/* ── Admin Table Actions ── */
function initAdminActions() {
  document.querySelectorAll('.action-btn.del').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      if (confirm('Delete this product?')) {
        row.style.opacity = '0';
        row.style.transition = 'opacity 0.3s';
        setTimeout(() => row.remove(), 300);
        Toast.success('Product deleted');
      }
    });
  });
  document.querySelectorAll('.action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => Toast.info('Edit panel coming soon'));
  });
  const addBtn = document.querySelector('.table-add');
  if (addBtn) addBtn.addEventListener('click', () => Toast.info('Add product modal coming soon'));
}

/* ── Sidebar Active State ── */
function initSidebar() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (item.getAttribute('href') === page) item.classList.add('active');
  });
}

/* ── Search Bar ── */
function initSearch() {
  const input = document.querySelector('.navbar-search input');
  if (!input) return;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = `products.html?q=${encodeURIComponent(q)}`;
    }
  });

  // Pre-fill search from URL
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    input.value = params.get('q');
    const grid = document.querySelector('.product-grid');
    if (grid) {
      const q = params.get('q').toLowerCase();
      const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
      grid.innerHTML = '';
      filtered.forEach(p => grid.appendChild(buildProductCard(p)));
      grid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = PRODUCTS.find(p => p.id === parseInt(btn.dataset.id));
          if (product) { Cart.addItem(product); Toast.success(`${product.name} added`); }
        });
      });
    }
  }
}

/* ── Init on DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartUI();
  initCategoryFilter();
  initSearch();
  initAuthForms();
  initAdminActions();
  initSidebar();

  // Auto-render product grid
  const grid = document.querySelector('.product-grid[data-auto-render]');
  if (grid) renderProducts(grid);

  // Cart page
  if (document.getElementById('cart-items')) {
    renderCartPage();
    initPromoCode();
    initCheckout();
    window.addEventListener('cartUpdated', renderCartPage);
  }
});
