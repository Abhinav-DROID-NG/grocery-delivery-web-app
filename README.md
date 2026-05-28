# Grocery Delivery Web App

A modern, responsive grocery delivery platform built with Flask and vanilla JavaScript.

## Project Structure

```
grocery-delivery-web-app/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── templates/             # HTML templates (Jinja2)
│   ├── index.html        # Home page
│   ├── products.html     # Products listing page
│   └── cart.html         # Shopping cart page
├── static/               # Static files (CSS & JavaScript)
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       ├── script.js     # Global utilities & cart management
│       ├── products.js   # Products page functionality
│       └── cart.js       # Cart & checkout functionality
├── database/             # Database folder
│   └── grocery.db        # SQLite database (auto-created)
└── README.md            # Documentation
```

## Features

✨ **Core Features:**
- 🛒 Shopping cart (client-side with localStorage)
- 🔍 Product search and category filtering
- 📦 Product inventory management
- 💳 Checkout with customer details
- 📊 Order tracking

✅ **No Authentication:**
- Public access to all features
- No user accounts required
- Simple, fast checkout process

## Installation

### Requirements
- Python 3.7+
- pip

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/Abhinav-DROID-NG/grocery-delivery-web-app.git
cd grocery-delivery-web-app
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the application:**
```bash
python app.py
```

5. **Access the app:**
- Open browser and go to `http://localhost:5000`

## API Endpoints

### Products
- `GET /` - Home page
- `GET /products` - Products page
- `GET /api/products` - Get all products (JSON)

### Cart
- `GET /cart` - Shopping cart page
- `POST /api/cart/add` - Add product to cart
- `DELETE /api/cart/remove/<id>` - Remove from cart
- `PUT /api/cart/update/<id>` - Update quantity

### Orders
- `POST /api/checkout` - Place order
- `GET /api/orders` - Get all orders

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP
)
```

### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    created_at TIMESTAMP
)
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
)
```

## Technologies Used

- **Backend:** Flask, SQLite3
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** SQLite
- **Storage:** LocalStorage (client-side cart)

## File Structure Explanation

- **`app.py`** - Main Flask application with all routes and database operations
- **`templates/`** - Jinja2 HTML templates rendered by Flask
- **`static/css/style.css`** - Responsive CSS styling
- **`static/js/script.js`** - Global utilities, cart management, and API calls
- **`static/js/products.js`** - Products page search and filtering
- **`static/js/cart.js`** - Cart operations and checkout logic
- **`database/`** - Stores the SQLite database file

## Contributing

Feel free to fork, modify, and submit pull requests!

## License

This project is open source and available under the MIT License.

---

**Happy Shopping! 🛒**
