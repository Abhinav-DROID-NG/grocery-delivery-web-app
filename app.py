from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-in-production'

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
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
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
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ''')
    
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            delivery_address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
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

def login_required(f):
    """Decorator to check if user is logged in"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to check if user is admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT is_admin FROM users WHERE id = ?', (session['user_id'],))
        user = cursor.fetchone()
        db.close()
        
        if not user or not user['is_admin']:
            return redirect(url_for('index'))
        
        return f(*args, **kwargs)
    return decorated_function

# Routes

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not username or not email or not password:
            return jsonify({'error': 'All fields required'}), 400
        
        db = get_db()
        cursor = db.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                (username, email, generate_password_hash(password))
            )
            db.commit()
            db.close()
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            db.close()
            return jsonify({'error': 'Username or email already exists'}), 400
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        db.close()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            return redirect(url_for('products'))
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """User logout"""
    session.pop('user_id', None)
    return redirect(url_for('index'))

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
@login_required
def cart():
    """Display user cart"""
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute('''
        SELECT c.id, p.id as product_id, p.name, p.price, c.quantity, (p.price * c.quantity) as total
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ''', (session['user_id'],))
    
    cart_items = cursor.fetchall()
    
    total_price = sum(item['total'] for item in cart_items)
    
    db.close()
    
    return render_template('cart.html', cart_items=cart_items, total_price=total_price)

@app.route('/api/cart/add', methods=['POST'])
@login_required
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
    cursor.execute('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
                   (session['user_id'], product_id))
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute('UPDATE cart SET quantity = quantity + ? WHERE id = ?', 
                       (quantity, existing['id']))
    else:
        cursor.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                       (session['user_id'], product_id, quantity))
    
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'message': 'Product added to cart'})

@app.route('/api/cart/remove/<int:cart_id>', methods=['DELETE'])
@login_required
def remove_from_cart(cart_id):
    """Remove product from cart"""
    db = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', (cart_id, session['user_id']))
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'message': 'Product removed from cart'})

@app.route('/api/checkout', methods=['POST'])
@login_required
def checkout():
    """Checkout and create order"""
    data = request.json
    delivery_address = data.get('delivery_address')
    
    db = get_db()
    cursor = db.cursor()
    
    # Get cart items
    cursor.execute('''
        SELECT c.id, p.id as product_id, p.price, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    ''', (session['user_id'],))
    
    cart_items = cursor.fetchall()
    
    if not cart_items:
        db.close()
        return jsonify({'error': 'Cart is empty'}), 400
    
    total_price = sum(item['price'] * item['quantity'] for item in cart_items)
    
    # Create order
    cursor.execute('INSERT INTO orders (user_id, total_price, delivery_address) VALUES (?, ?, ?)',
                   (session['user_id'], total_price, delivery_address))
    order_id = cursor.lastrowid
    
    # Add order items
    for item in cart_items:
        cursor.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                       (order_id, item['product_id'], item['quantity'], item['price']))
        
        # Update product stock
        cursor.execute('UPDATE products SET stock = stock - ? WHERE id = ?',
                       (item['quantity'], item['product_id']))
    
    # Clear cart
    cursor.execute('DELETE FROM cart WHERE user_id = ?', (session['user_id'],))
    
    db.commit()
    db.close()
    
    return jsonify({'success': True, 'order_id': order_id, 'message': 'Order placed successfully'})

@app.route('/admin')
@admin_required
def admin():
    """Admin dashboard"""
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM users')
    user_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM products')
    product_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM orders')
    order_count = cursor.fetchone()['count']
    
    cursor.execute('SELECT SUM(total_price) as total FROM orders')
    total_revenue = cursor.fetchone()['total'] or 0
    
    db.close()
    
    stats = {
        'users': user_count,
        'products': product_count,
        'orders': order_count,
        'revenue': total_revenue
    }
    
    return render_template('admin.html', stats=stats)

@app.route('/api/admin/products', methods=['GET', 'POST'])
@admin_required
def manage_products():
    """Manage products"""
    db = get_db()
    cursor = db.cursor()
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM products')
        products_list = cursor.fetchall()
        db.close()
        return jsonify([dict(p) for p in products_list])
    
    elif request.method == 'POST':
        data = request.json
        cursor.execute('''
            INSERT INTO products (name, category, price, description, image_url, stock)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['name'], data['category'], data['price'], data['description'], 
              data.get('image_url'), data['stock']))
        
        db.commit()
        db.close()
        return jsonify({'success': True, 'message': 'Product added'})

@app.route('/api/admin/products/<int:product_id>', methods=['PUT', 'DELETE'])
@admin_required
def update_product(product_id):
    """Update or delete product"""
    db = get_db()
    cursor = db.cursor()
    
    if request.method == 'PUT':
        data = request.json
        cursor.execute('''
            UPDATE products
            SET name = ?, category = ?, price = ?, description = ?, stock = ?
            WHERE id = ?
        ''', (data['name'], data['category'], data['price'], data['description'], 
              data['stock'], product_id))
        
        db.commit()
        db.close()
        return jsonify({'success': True, 'message': 'Product updated'})
    
    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))
        db.commit()
        db.close()
        return jsonify({'success': True, 'message': 'Product deleted'})

if __name__ == '__main__':
    # Initialize database
    if not os.path.exists('database'):
        os.makedirs('database')
    
    init_db()
    
    # Run app
    app.run(debug=True)
