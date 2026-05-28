from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# Database configuration
DATABASE = 'database/grocery.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with tables"""
    db = get_db()
    cursor = db.cursor()
    
    # Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            image_url TEXT,
            stock INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Cart table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            delivery_address TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Order items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    
    db.commit()
    db.close()

# Routes

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/products')
def products():
    """Display all products"""
    category = request.args.get('category', 'all')
    
    db = get_db()
    cursor = db.cursor()
    
    if category == 'all':
        cursor.execute('SELECT * FROM products WHERE stock > 0')
    else:
        cursor.execute('SELECT * FROM products WHERE category = ? AND stock > 0', (category,))
    
    products_list = cursor.fetchall()
    
    cursor.execute('SELECT DISTINCT category FROM products')
    categories = cursor.fetchall()
    
    db.close()
    
    return render_template('products.html', products=products_list, categories=categories, selected_category=category)

@app.route('/cart')
def cart():
    """Display shopping cart"""
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute('''
        SELECT c.id, p.id as product_id, p.name, p.price, c.quantity, (p.price * c.quantity) as total
        FROM cart c
        JOIN products p ON c.product_id = p.id
    ''')
    
    cart_items = cursor.fetchall()
    
    total_price = sum(item['total'] for item in cart_items) if cart_items else 0
    
    db.close()
    
    return render_template('cart.html', cart_items=cart_items, total_price=total_price)

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add product to cart"""
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    db = get_db()
    cursor = db.cursor()
    
    # Check if product exists
    cursor.execute('SELECT stock FROM products WHERE id = ?', (product_id,))
    product = cursor.fetchone()
    
    if not product or product['stock'] < quantity:
        db.close()
        return jsonify({'error': 'Product not available'}), 400
    
    # Check if already in cart
    cursor.execute('SELECT id, quantity FROM cart WHERE product_id = ?', (product_id,))
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute('UPDATE cart SET quantity = quantity + ? WHERE id = ?', 
                       (quantity, existing['id']))
    else:
        cursor.execute('INSERT INTO cart (product_id, quantity) VALUES (?, ?)',
                       (product_id, quantity))
    
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'message': 'Product added to cart'})

@app.route('/api/cart/remove/<int:cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    """Remove product from cart"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM cart WHERE id = ?', (cart_id,))
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'message': 'Product removed from cart'})

@app.route('/api/cart/update/<int:cart_id>', methods=['PUT'])
def update_cart_quantity(cart_id):
    """Update product quantity in cart"""
    data = request.json
    quantity = data.get('quantity', 1)
    
    if quantity < 1:
        return jsonify({'error': 'Quantity must be at least 1'}), 400
    
    db = get_db()
    cursor = db.cursor()
    cursor.execute('UPDATE cart SET quantity = ? WHERE id = ?', (quantity, cart_id))
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'message': 'Quantity updated'})

@app.route('/api/checkout', methods=['POST'])
def checkout():
    """Checkout and create order"""
    data = request.json
    delivery_address = data.get('delivery_address')
    customer_name = data.get('customer_name')
    customer_email = data.get('customer_email')
    customer_phone = data.get('customer_phone')
    
    if not all([delivery_address, customer_name, customer_email, customer_phone]):
        return jsonify({'error': 'All fields required'}), 400
    
    db = get_db()
    cursor = db.cursor()
    
    # Get cart items
    cursor.execute('''
        SELECT c.id, p.id as product_id, p.price, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
    ''')
    
    cart_items = cursor.fetchall()
    
    if not cart_items:
        db.close()
        return jsonify({'error': 'Cart is empty'}), 400
    
    total_price = sum(item['price'] * item['quantity'] for item in cart_items)
    
    # Create order
    cursor.execute('''
        INSERT INTO orders (total_price, delivery_address, customer_name, customer_email, customer_phone)
        VALUES (?, ?, ?, ?, ?)
    ''', (total_price, delivery_address, customer_name, customer_email, customer_phone))
    
    order_id = cursor.lastrowid
    
    # Add order items
    for item in cart_items:
        cursor.execute('''
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        ''', (order_id, item['product_id'], item['quantity'], item['price']))
        
        # Update product stock
        cursor.execute('UPDATE products SET stock = stock - ? WHERE id = ?',
                       (item['quantity'], item['product_id']))
    
    # Clear cart
    cursor.execute('DELETE FROM cart')
    
    db.commit()
    db.close()
    
    return jsonify({
        'success': True,
        'order_id': order_id,
        'message': 'Order placed successfully'
    })

@app.route('/api/products', methods=['GET'])
def api_products():
    """Get all products as JSON"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM products')
    products_list = cursor.fetchall()
    db.close()
    
    return jsonify([dict(p) for p in products_list])

@app.route('/api/orders', methods=['GET'])
def api_orders():
    """Get all orders"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM orders ORDER BY created_at DESC')
    orders_list = cursor.fetchall()
    db.close()
    
    return jsonify([dict(o) for o in orders_list])

if __name__ == '__main__':
    # Initialize database
    if not os.path.exists('database'):
        os.makedirs('database')
    
    init_db()
    
    # Run app
    app.run(debug=True)
