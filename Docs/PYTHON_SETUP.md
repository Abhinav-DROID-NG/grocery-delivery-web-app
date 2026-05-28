# GroceryHub Python Backend Setup Guide

## 🚀 Quick Start (5 minutes)

### 1️⃣ Install Python (if not already installed)
```bash
# Check if Python is installed
python --version
# Should be Python 3.7 or higher
```

### 2️⃣ Create project folder
```bash
mkdir groceryhub-backend
cd groceryhub-backend
```

### 3️⃣ Create virtual environment (optional but recommended)
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4️⃣ Install dependencies
```bash
pip install flask flask-cors
```

### 5️⃣ Create server.py
Copy the `server.py` file into this folder

### 6️⃣ Run the server
```bash
python server.py
```

✅ **Server running on http://localhost:5000**

---

## 📋 What's Installed

```
flask==2.3.0          → Web framework
flask-cors==4.0.0     → Handle cross-origin requests
```

---

## 🔐 Minimal Auth Explanation

### How Authentication Works:

1. **Register** → User provides name, email, password
2. **Generate Token** → Random token string is created
3. **Login** → Token returned to frontend
4. **API Calls** → Frontend sends token in header
5. **Verify** → Backend checks if token exists

```
Header: Authorization: Bearer token_abc123xyz
         ↓
Backend looks up token in tokens dictionary
         ↓
Returns user_id if found
```

### Token Storage (in-memory):
```python
tokens = {
  "token_abc123xyz": 1,      # token -> user_id
  "token_def456uvw": 2,
  "token_ghi789rst": 3,
}
```

**No database, no complex JWT - just simple key-value lookup!**

---

## 📊 In-Memory Storage Structure

### Users
```python
users = [
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "phone": "9876543210"
  }
]
```

### Products
```python
products = [
  {
    "id": 1,
    "name": "Organic Tomatoes",
    "price": 45,
    "category": "vegetables",
    "emoji": "🍅",
    "rating": 4.5,
    "stock": 50
  }
]
```

### Carts
```python
carts = {
  1: [              # user_id: 1
    {
      "id": 1,
      "name": "Organic Tomatoes",
      "price": 45,
      "quantity": 2,
      ...
    }
  ]
}
```

### Orders
```python
orders = [
  {
    "id": "ORD-ABC123",
    "userId": 1,
    "items": [...],
    "total": 144.50,
    "status": "confirmed",
    "createdAt": "2024-05-28T10:30:00"
  }
]
```

---

## 🔌 Test APIs with cURL

### Test 1: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "phone": "9876543210"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "token_abc123xyz"
}
```

### Test 2: Get Products
```bash
curl http://localhost:5000/api/products
```

**Response**:
```json
{
  "success": true,
  "products": [...],
  "total": 24
}
```

### Test 3: Get Products by Category
```bash
curl http://localhost:5000/api/products?category=fruits
```

### Test 4: Add to Cart (Requires Token)
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_abc123xyz" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

### Test 5: Get Cart
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer token_abc123xyz"
```

### Test 6: Create Order
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_abc123xyz" \
  -d '{
    "deliveryAddress": "123 Main St, City",
    "phone": "9876543210"
  }'
```

### Test 7: Admin Stats
```bash
curl http://localhost:5000/api/admin/stats
```

---

## 🌐 Connect Frontend to Backend

In the HTML file, add these changes:

### Before Frontend JavaScript:
```javascript
const API_URL = 'http://localhost:5000';
let currentToken = localStorage.getItem('authToken');

// Update handleLogin function
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      currentToken = data.token;
      localStorage.setItem('authToken', currentToken);
      alert('Login successful!');
      navigateTo('home');
    } else {
      alert('Login failed: ' + data.message);
    }
  });
}

// Update addToCart function
function addToCart(productId) {
  if (!currentToken) {
    alert('Please login first');
    navigateTo('login');
    return;
  }

  fetch(`${API_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentToken}`
    },
    body: JSON.stringify({ productId, quantity: 1 })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      updateCartCount();
      updateProductButtons();
    }
  });
}

// Update renderProducts
function renderProducts(filter = null) {
  fetch(`${API_URL}/api/products${filter ? '?category=' + filter : ''}`)
    .then(res => res.json())
    .then(data => {
      const html = data.products.map(p => createProductCard(p)).join('');
      document.getElementById('productsGrid').innerHTML = html;
    });
}
```

---

## ⚙️ Code Structure

```
server.py (500 lines total)
├── Imports & Setup
├── In-Memory Storage (lines 12-80)
├── Helper Functions (lines 82-110)
├── Middleware (lines 112-125)
├── Auth Routes (lines 127-195)
├── Products Routes (lines 197-230)
├── Cart Routes (lines 232-315)
├── Orders Routes (lines 317-400)
├── Admin Routes (lines 402-460)
├── Error Handlers (lines 462-475)
├── Health Check (lines 477-480)
└── Start Server (lines 482-485)
```

---

## 🧪 Test the Whole Flow

1. **Register**: Create account
2. **Login**: Get token
3. **Get Products**: Fetch all products
4. **Add to Cart**: Add items
5. **Get Cart**: View cart with totals
6. **Create Order**: Place order
7. **Get Orders**: View order history
8. **Admin Stats**: Check dashboard

---

## 📝 Environment Variables (Optional)

Create `.env` file if you want to customize:

```
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000
```

Then load in `server.py`:
```python
from dotenv import load_dotenv
import os

load_dotenv()
port = int(os.getenv('PORT', 5000))
```

---

## 🐛 Debugging

### Check if server is running
```bash
curl http://localhost:5000/health
```

### View console output
Server prints all requests and responses in terminal

### Common Issues

**Port 5000 already in use?**
```bash
# Change port in server.py
app.run(debug=True, port=8000)  # Use 8000 instead
```

**CORS errors?**
✅ Already handled with `CORS(app)`

**Token not working?**
- Make sure token is in header: `Authorization: Bearer {token}`
- Check that token exists in `tokens` dictionary

---

## 📦 Upgrade to Database (Later)

When ready to use a real database, just change the storage:

### Option 1: SQLite (Easiest)
```bash
pip install flask-sqlalchemy
```

### Option 2: MongoDB
```bash
pip install pymongo
```

### Option 3: PostgreSQL
```bash
pip install psycopg2
```

The API endpoints stay exactly the same! Just change the data layer.

---

## ✅ Checklist

- [ ] Python 3.7+ installed
- [ ] Virtual environment created
- [ ] Flask & Flask-CORS installed
- [ ] server.py file created
- [ ] Server running on port 5000
- [ ] Can access http://localhost:5000/health
- [ ] Frontend connected to backend
- [ ] Can register & login
- [ ] Can add to cart
- [ ] Can create order

---

## 🚀 You're Done!

Your Python backend is ready to power the GroceryHub frontend!

**Key Points:**
- ✅ No database needed
- ✅ Minimal authentication (just tokens)
- ✅ In-memory storage (24 products, users, orders)
- ✅ 17 APIs total
- ✅ Easy to upgrade later

Enjoy! 💚
