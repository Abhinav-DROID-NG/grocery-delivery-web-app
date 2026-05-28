# GroceryHub Backend APIs - Complete List

## ⚡ Quick Setup (No Database)

### Technologies
- **Framework**: Node.js + Express.js
- **Storage**: In-memory arrays (no database)
- **Port**: 5000

---

## 📋 ALL APIS

### 1️⃣ AUTHENTICATION APIS

#### POST /api/auth/register
**Purpose**: Create new user account

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "9876543210"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "token": "abc123xyz"
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

#### POST /api/auth/login
**Purpose**: User login

**Request**:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "abc123xyz"
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2️⃣ PRODUCTS APIS

#### GET /api/products
**Purpose**: Get all products with optional filtering

**Query Parameters**:
- `category` (optional): vegetables, fruits, dairy, bakery, snacks, beverages
- `search` (optional): search term for product name
- `limit` (optional): number of products (default: 24)

**Example**: `/api/products?category=fruits&limit=10`

**Response** (200):
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Organic Tomatoes",
      "price": 45,
      "category": "vegetables",
      "emoji": "🍅",
      "rating": 4.5,
      "stock": 50,
      "description": "Fresh organic tomatoes"
    },
    {
      "id": 2,
      "name": "Fresh Spinach",
      "price": 35,
      "category": "vegetables",
      "emoji": "🥬",
      "rating": 4.3,
      "stock": 30,
      "description": "Freshly picked spinach"
    }
  ],
  "total": 2
}
```

---

#### GET /api/products/:id
**Purpose**: Get single product details

**Example**: `/api/products/1`

**Response** (200):
```json
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Organic Tomatoes",
    "price": 45,
    "category": "vegetables",
    "emoji": "🍅",
    "rating": 4.5,
    "reviews": [
      {
        "user": "john@example.com",
        "rating": 5,
        "comment": "Very fresh!"
      }
    ],
    "stock": 50,
    "description": "Fresh organic tomatoes"
  }
}
```

---

### 3️⃣ CART APIS

#### POST /api/cart/add
**Purpose**: Add product to cart

**Headers**: 
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": {
    "id": "user123-cart",
    "userId": 1,
    "items": [
      {
        "id": 1,
        "name": "Organic Tomatoes",
        "price": 45,
        "quantity": 2,
        "total": 90
      }
    ],
    "subtotal": 90,
    "tax": 4.5,
    "delivery": 50,
    "grandTotal": 144.5
  }
}
```

---

#### GET /api/cart
**Purpose**: Get user's current cart

**Headers**: 
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": 1,
        "name": "Organic Tomatoes",
        "price": 45,
        "quantity": 2,
        "total": 90,
        "emoji": "🍅"
      }
    ],
    "subtotal": 90,
    "tax": 4.5,
    "delivery": 50,
    "grandTotal": 144.5
  }
}
```

---

#### PUT /api/cart/update
**Purpose**: Update quantity of item in cart

**Headers**: 
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "productId": 1,
  "quantity": 5
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cart updated",
  "cart": { /* updated cart */ }
}
```

---

#### DELETE /api/cart/remove/:productId
**Purpose**: Remove item from cart

**Headers**: 
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": { /* updated cart */ }
}
```

---

#### DELETE /api/cart/clear
**Purpose**: Clear entire cart

**Headers**: 
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

### 4️⃣ ORDERS APIS

#### POST /api/orders/create
**Purpose**: Place new order

**Headers**: 
```
Authorization: Bearer {token}
```

**Request**:
```json
{
  "deliveryAddress": "123 Main St, City",
  "phone": "9876543210"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "id": "ORD-12345",
    "userId": 1,
    "items": [
      {
        "id": 1,
        "name": "Organic Tomatoes",
        "quantity": 2,
        "price": 45
      }
    ],
    "subtotal": 90,
    "tax": 4.5,
    "delivery": 50,
    "total": 144.5,
    "status": "confirmed",
    "createdAt": "2024-05-28T10:30:00Z",
    "estimatedDelivery": "30 minutes"
  }
}
```

---

#### GET /api/orders
**Purpose**: Get all orders of logged-in user

**Headers**: 
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "orders": [
    {
      "id": "ORD-12345",
      "total": 144.5,
      "status": "delivered",
      "createdAt": "2024-05-28T10:30:00Z",
      "itemCount": 5
    }
  ],
  "total": 1
}
```

---

#### GET /api/orders/:orderId
**Purpose**: Get single order details

**Headers**: 
```
Authorization: Bearer {token}
```

**Response** (200):
```json
{
  "success": true,
  "order": {
    "id": "ORD-12345",
    "userId": 1,
    "items": [ /* items */ ],
    "total": 144.5,
    "status": "delivered",
    "deliveryAddress": "123 Main St, City",
    "createdAt": "2024-05-28T10:30:00Z",
    "timeline": [
      { "status": "confirmed", "time": "2024-05-28T10:30:00Z" },
      { "status": "preparing", "time": "2024-05-28T10:35:00Z" },
      { "status": "on_the_way", "time": "2024-05-28T10:50:00Z" },
      { "status": "delivered", "time": "2024-05-28T11:00:00Z" }
    ]
  }
}
```

---

### 5️⃣ ADMIN APIS

#### GET /api/admin/stats
**Purpose**: Get dashboard statistics (no auth required for demo)

**Response** (200):
```json
{
  "success": true,
  "stats": {
    "totalUsers": 45,
    "totalProducts": 24,
    "totalOrders": 128,
    "totalRevenue": 45000,
    "todayOrders": 12,
    "todayRevenue": 3500,
    "averageOrderValue": 351.56
  }
}
```

---

#### GET /api/admin/products
**Purpose**: Get all products with stock info

**Response** (200):
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Organic Tomatoes",
      "price": 45,
      "stock": 50,
      "category": "vegetables",
      "status": "in_stock"
    }
  ],
  "total": 24
}
```

---

#### PUT /api/admin/products/:id/stock
**Purpose**: Update product stock

**Request**:
```json
{
  "stock": 100
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Stock updated",
  "product": {
    "id": 1,
    "name": "Organic Tomatoes",
    "stock": 100
  }
}
```

---

#### GET /api/admin/orders
**Purpose**: Get all orders (for admin)

**Response** (200):
```json
{
  "success": true,
  "orders": [
    {
      "id": "ORD-12345",
      "user": "john@example.com",
      "total": 144.5,
      "status": "delivered",
      "createdAt": "2024-05-28T10:30:00Z"
    }
  ],
  "total": 128
}
```

---

## 🚀 SUPER SIMPLE BACKEND (No Database)

### File Structure
```
backend/
├── server.js          (Main server)
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   └── admin.js
└── data.js            (In-memory storage)
```

### Complete Server Code (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ==================== IN-MEMORY STORAGE ====================
let users = [];
let products = [
  { id: 1, name: 'Organic Tomatoes', price: 45, category: 'vegetables', emoji: '🍅', rating: 4.5, stock: 50 },
  { id: 2, name: 'Fresh Spinach', price: 35, category: 'vegetables', emoji: '🥬', rating: 4.3, stock: 30 },
  // ... 22 more products
];
let carts = {}; // userId -> cart
let orders = [];
let tokens = {}; // token -> userId

// ==================== HELPER FUNCTIONS ====================

function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 9);
}

function getUserIdFromToken(token) {
  return tokens[token];
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }
  
  const user = { id: users.length + 1, name, email, password, phone };
  users.push(user);
  
  const token = generateToken();
  tokens[token] = user.id;
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: user.id, name, email, phone },
    token
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const token = generateToken();
  tokens[token] = user.id;
  
  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, name: user.name, email: user.email },
    token
  });
});

// ==================== PRODUCTS ROUTES ====================

app.get('/api/products', (req, res) => {
  let filtered = products;
  
  if (req.query.category) {
    filtered = filtered.filter(p => p.category === req.query.category);
  }
  
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
  }
  
  const limit = req.query.limit || 24;
  filtered = filtered.slice(0, limit);
  
  res.json({ success: true, products: filtered, total: filtered.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json({ success: true, product });
});

// ==================== CART ROUTES ====================

app.post('/api/cart/add', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  
  if (!carts[userId]) carts[userId] = [];
  
  const existingItem = carts[userId].find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userId].push({ ...product, quantity });
  }
  
  const cart = getCartWithTotals(userId);
  res.status(201).json({ success: true, message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const cart = getCartWithTotals(userId);
  res.json({ success: true, cart });
});

app.put('/api/cart/update', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const { productId, quantity } = req.body;
  if (!carts[userId]) carts[userId] = [];
  
  const item = carts[userId].find(item => item.id === productId);
  if (item) item.quantity = quantity;
  
  const cart = getCartWithTotals(userId);
  res.json({ success: true, message: 'Cart updated', cart });
});

app.delete('/api/cart/remove/:productId', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  carts[userId] = carts[userId].filter(item => item.id !== parseInt(req.params.productId));
  const cart = getCartWithTotals(userId);
  
  res.json({ success: true, message: 'Item removed from cart', cart });
});

app.delete('/api/cart/clear', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  carts[userId] = [];
  res.json({ success: true, message: 'Cart cleared' });
});

// ==================== ORDERS ROUTES ====================

app.post('/api/orders/create', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const { deliveryAddress, phone } = req.body;
  const cart = carts[userId] || [];
  
  if (cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  
  const items = cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }));
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = 50;
  const total = subtotal + tax + delivery;
  
  const order = {
    id: 'ORD-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    userId,
    items,
    subtotal,
    tax,
    delivery,
    total,
    status: 'confirmed',
    deliveryAddress,
    phone,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '30 minutes',
    timeline: [
      { status: 'confirmed', time: new Date().toISOString() }
    ]
  };
  
  orders.push(order);
  carts[userId] = [];
  
  res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

app.get('/api/orders', (req, res) => {
  const userId = getUserIdFromToken(req.headers.authorization?.split(' ')[1]);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const userOrders = orders.filter(o => o.userId === userId);
  res.json({ success: true, orders: userOrders, total: userOrders.length });
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.id === req.params.orderId);
  
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  
  res.json({ success: true, order });
});

// ==================== ADMIN ROUTES ====================

app.get('/api/admin/stats', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  
  res.json({
    success: true,
    stats: {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue),
      todayOrders: todayOrders.length,
      todayRevenue: Math.round(todayOrders.reduce((sum, o) => sum + o.total, 0)),
      averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
    }
  });
});

app.get('/api/admin/products', (req, res) => {
  res.json({ success: true, products, total: products.length });
});

app.put('/api/admin/products/:id/stock', (req, res) => {
  const { stock } = req.body;
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  product.stock = stock;
  res.json({ success: true, message: 'Stock updated', product });
});

app.get('/api/admin/orders', (req, res) => {
  res.json({ success: true, orders, total: orders.length });
});

// ==================== HELPER ====================

function getCartWithTotals(userId) {
  const items = carts[userId] || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = 50;
  
  return {
    items,
    subtotal,
    tax,
    delivery,
    grandTotal: subtotal + tax + delivery
  };
}

// ==================== START SERVER ====================

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 GroceryHub Backend running on http://localhost:${PORT}`);
});
```

---

## 📦 Installation & Run

### 1. Create Node project
```bash
mkdir groceryhub-backend
cd groceryhub-backend
npm init -y
```

### 2. Install dependencies
```bash
npm install express cors
```

### 3. Save server code in `server.js`

### 4. Run server
```bash
node server.js
```

✅ Server running on `http://localhost:5000`

---

## 🔌 Connect Frontend to Backend

Update frontend HTML to make API calls:

```javascript
const API_URL = 'http://localhost:5000';
let authToken = localStorage.getItem('token');

async function addToCart(productId) {
  const response = await fetch(`${API_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ productId, quantity: 1 })
  });
  
  const data = await response.json();
  console.log(data);
}
```

---

## 📝 Summary

| Feature | API | Method |
|---------|-----|--------|
| Register | `/api/auth/register` | POST |
| Login | `/api/auth/login` | POST |
| Get Products | `/api/products` | GET |
| Add to Cart | `/api/cart/add` | POST |
| Get Cart | `/api/cart` | GET |
| Create Order | `/api/orders/create` | POST |
| Get Stats | `/api/admin/stats` | GET |

**Total APIs: 17**
**Database: None (in-memory)**
**Setup Time: 5 minutes**
