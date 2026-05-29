const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

const frontendDir = path.join(__dirname, '..', 'Frontend');
app.use('/frontend', express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'groceryhub.html'));
});

// ==================== IN-MEMORY STORAGE ====================
const productCatalog = {
  "vegetables": [
    ["Organic Tomatoes", 45, "🍅", "Fresh organic tomatoes"],
    ["Fresh Spinach", 35, "🥬", "Freshly picked spinach"],
    ["Carrots", 30, "🥕", "Crunchy orange carrots"],
    ["Green Capsicum", 55, "🫑", "Crisp green capsicum"],
    ["Red Onions", 42, "🧅", "Kitchen staple red onions"],
    ["Potatoes", 38, "🥔", "Farm fresh potatoes"],
    ["Cauliflower", 60, "🥦", "Fresh cauliflower head"],
    ["Broccoli", 95, "🥦", "Tender green broccoli"],
    ["Cabbage", 35, "🥬", "Fresh green cabbage"],
    ["Cucumber", 32, "🥒", "Cool crunchy cucumbers"],
    ["Bottle Gourd", 40, "🥒", "Tender bottle gourd"],
    ["Bitter Gourd", 48, "🥒", "Fresh bitter gourd"],
    ["Okra", 54, "🌶️", "Tender green okra"],
    ["Green Beans", 75, "🫛", "Fresh green beans"],
    ["Green Peas", 90, "🫛", "Sweet green peas"],
    ["Sweet Corn", 65, "🌽", "Juicy sweet corn"],
    ["Eggplant", 44, "🍆", "Glossy purple eggplant"],
    ["Mushrooms", 120, "🍄", "Button mushrooms"],
    ["Ginger", 85, "🫚", "Aromatic fresh ginger"],
    ["Garlic", 95, "🧄", "Peeled fresh garlic"],
    ["Green Chillies", 35, "🌶️", "Spicy green chillies"],
    ["Coriander Leaves", 20, "🌿", "Fresh coriander bunch"],
    ["Mint Leaves", 22, "🌿", "Cooling mint leaves"],
    ["Spring Onion", 50, "🧅", "Fresh spring onion"],
    ["Pumpkin", 42, "🎃", "Sweet yellow pumpkin"],
    ["Radish", 36, "🥕", "Crisp white radish"],
    ["Beetroot", 58, "🫒", "Earthy red beetroot"],
    ["Zucchini", 110, "🥒", "Fresh green zucchini"],
    ["Lettuce", 85, "🥬", "Leafy green lettuce"],
    ["Curry Leaves", 18, "🌿", "Aromatic curry leaves"]
  ],
  "fruits": [
    ["Red Apples", 120, "🍎", "Crispy red apples"],
    ["Bananas", 40, "🍌", "Sweet ripe bananas"],
    ["Alphonso Mangoes", 220, "🥭", "Sweet alphonso mangoes"],
    ["Oranges", 95, "🍊", "Juicy oranges"],
    ["Pomegranate", 160, "🍎", "Ruby red pomegranate"],
    ["Seedless Grapes", 110, "🍇", "Sweet seedless grapes"],
    ["Watermelon", 70, "🍉", "Refreshing watermelon"],
    ["Papaya", 65, "🍈", "Ripe papaya"],
    ["Pineapple", 90, "🍍", "Tropical pineapple"],
    ["Kiwi", 180, "🥝", "Imported green kiwi"],
    ["Strawberries", 240, "🍓", "Fresh strawberries"],
    ["Blueberries", 320, "🫐", "Premium blueberries"],
    ["Guava", 80, "🍐", "Crunchy guava"],
    ["Dragon Fruit", 210, "🐉", "Fresh dragon fruit"],
    ["Pear", 135, "🍐", "Juicy green pear"],
    ["Sapota", 75, "🥝", "Sweet sapota"],
    ["Muskmelon", 85, "🍈", "Fragrant muskmelon"],
    ["Tender Coconut", 55, "🥥", "Hydrating tender coconut"],
    ["Lychee", 190, "🍒", "Sweet lychee bunch"],
    ["Peaches", 210, "🍑", "Soft ripe peaches"],
    ["Plums", 185, "🍑", "Sweet and tart plums"],
    ["Avocado", 260, "🥑", "Creamy avocado"],
    ["Lemon", 45, "🍋", "Fresh yellow lemons"],
    ["Mosambi", 90, "🍊", "Sweet lime mosambi"],
    ["Black Grapes", 125, "🍇", "Juicy black grapes"]
  ],
  "dairy": [
    ["Whole Milk", 60, "🥛", "Farm fresh whole milk"],
    ["Cheddar Cheese", 250, "🧀", "Aged cheddar cheese"],
    ["Low Fat Milk", 58, "🥛", "Low fat toned milk"],
    ["Curd", 45, "🥣", "Thick fresh curd"],
    ["Greek Yogurt", 140, "🥣", "Protein-rich greek yogurt"],
    ["Paneer", 180, "🧀", "Soft fresh paneer"],
    ["Butter", 120, "🧈", "Creamy salted butter"],
    ["Ghee", 520, "🧈", "Pure cow ghee"],
    ["Mozzarella Cheese", 290, "🧀", "Stretchy mozzarella cheese"],
    ["Cheese Slices", 160, "🧀", "Ready cheese slices"],
    ["Fresh Cream", 95, "🥛", "Rich fresh cream"],
    ["Buttermilk", 35, "🥛", "Spiced buttermilk"],
    ["Lassi", 55, "🥛", "Sweet chilled lassi"],
    ["Flavored Yogurt", 75, "🥣", "Fruit flavored yogurt"],
    ["Condensed Milk", 140, "🥛", "Sweet condensed milk"],
    ["Dairy Whitener", 210, "🥛", "Instant dairy whitener"],
    ["Cottage Cheese", 220, "🧀", "Fresh cottage cheese"],
    ["Probiotic Drink", 60, "🥤", "Daily probiotic drink"],
    ["Ice Cream Tub", 240, "🍨", "Vanilla ice cream tub"],
    ["Milkshake", 85, "🥤", "Ready-to-drink milkshake"]
  ],
  "bakery": [
    ["Sourdough Bread", 80, "🍞", "Freshly baked sourdough"],
    ["Whole Wheat Bread", 55, "🍞", "Soft whole wheat bread"],
    ["Multigrain Bread", 75, "🍞", "Healthy multigrain bread"],
    ["Brown Bread", 60, "🍞", "Fresh brown bread"],
    ["Pav Buns", 45, "🥯", "Soft pav buns"],
    ["Burger Buns", 65, "🍔", "Sesame burger buns"],
    ["Croissants", 160, "🥐", "Buttery croissants"],
    ["Garlic Bread", 95, "🥖", "Ready garlic bread"],
    ["Baguette", 120, "🥖", "Classic French baguette"],
    ["Chocolate Muffins", 140, "🧁", "Soft chocolate muffins"],
    ["Blueberry Muffins", 150, "🧁", "Blueberry filled muffins"],
    ["Banana Bread", 130, "🍞", "Moist banana bread"],
    ["Fruit Cake", 280, "🍰", "Rich fruit cake"],
    ["Brownies", 180, "🍫", "Fudgy chocolate brownies"],
    ["Donuts", 120, "🍩", "Assorted donuts"],
    ["Rusk", 70, "🍞", "Crispy tea rysk"],
    ["Khari Biscuits", 90, "🥐", "Flaky khari biscuits"],
    ["Pizza Base", 85, "🍕", "Fresh pizza base"]
  ],
  "snacks": [
    ["Chocolate Cookies", 150, "🍪", "Delicious chocolate chip cookies"],
    ["Potato Chips", 55, "🥔", "Crispy salted chips"],
    ["Nachos", 95, "🌮", "Crunchy corn nachos"],
    ["Roasted Peanuts", 80, "🥜", "Salted roasted peanuts"],
    ["Trail Mix", 220, "🥜", "Nuts and berries mix"],
    ["Granola Bars", 180, "🍫", "Healthy granola bars"],
    ["Popcorn", 70, "🍿", "Ready-to-pop popcorn"],
    ["Banana Chips", 85, "🍌", "Crispy banana chips"],
    ["Murukku", 90, "🥨", "Crunchy rice murukku"],
    ["Mixture Namkeen", 75, "🥨", "Spicy namkeen mixture"],
    ["Sev", 65, "🥨", "Crispy sev snack"],
    ["Khakhra", 110, "🫓", "Roasted wheat khakhra"],
    ["Rice Crackers", 130, "🍘", "Light rice crackers"],
    ["Protein Chips", 160, "🥔", "High protein chips"],
    ["Dark Chocolate", 190, "🍫", "Premium dark chocolate"],
    ["Milk Chocolate", 120, "🍫", "Creamy milk chocolate"],
    ["Wafer Rolls", 100, "🍪", "Crispy wafer rolls"],
    ["Digestive Biscuits", 70, "🍪", "Whole wheat digestives"],
    ["Cream Biscuits", 55, "🍪", "Vanilla cream biscuits"],
    ["Energy Bar", 95, "🍫", "Quick energy bar"],
    ["Masala Makhana", 150, "🍿", "Roasted masala makhana"],
    ["Corn Puffs", 45, "🌽", "Cheesy corn puffs"]
  ],
  "beverages": [
    ["Orange Juice", 90, "🧃", "100% pure orange juice"],
    ["Apple Juice", 95, "🧃", "Clear apple juice"],
    ["Mango Juice", 100, "🧃", "Sweet mango juice"],
    ["Mixed Fruit Juice", 105, "🧃", "Mixed fruit drink"],
    ["Coconut Water", 55, "🥥", "Natural coconut water"],
    ["Mineral Water", 20, "💧", "Packaged mineral water"],
    ["Sparkling Water", 85, "💧", "Refreshing sparkling water"],
    ["Cola", 45, "🥤", "Classic cola drink"],
    ["Lemon Soda", 40, "🥤", "Zesty lemon soda"],
    ["Iced Tea", 75, "🧋", "Chilled lemon iced tea"],
    ["Cold Coffee", 110, "☕", "Ready cold coffee"],
    ["Green Tea Bags", 180, "🍵", "Green tea bags"],
    ["Black Tea", 140, "☕", "Strong black tea"],
    ["Instant Coffee", 260, "☕", "Premium instant coffee"],
    ["Filter Coffee Powder", 220, "☕", "South Indian filter coffee"],
    ["Hot Chocolate Mix", 180, "☕", "Chocolate drink mix"],
    ["Energy Drink", 125, "🥤", "Caffeinated energy drink"],
    ["Sports Drink", 95, "🥤", "Electrolyte sports drink"],
    ["Rose Milk", 70, "🥛", "Sweet rose milk"],
    ["Badam Drink", 85, "🥛", "Almond flavored drink"]
  ]
};

let nextProductId = 1;
let products = Object.entries(productCatalog).flatMap(([category, items]) =>
  items.map(([name, price, emoji, description], index) => ({
    id: nextProductId++,
    name,
    price,
    category,
    emoji,
    rating: Number((4.1 + ((nextProductId + index) % 9) / 10).toFixed(1)),
    stock: 12 + ((nextProductId * 7 + index * 3) % 89),
    description
  }))
);

let users = {}; // email -> { name, password, email }
let carts = {}; // email -> cart items array
let orders = [];

// ==================== HELPER FUNCTIONS ====================

function getCartWithTotals(userEmail) {
  const items = carts[userEmail] || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = items.length > 0 ? 50 : 0;
  
  return {
    items,
    subtotal,
    tax,
    delivery,
    grandTotal: subtotal + tax + delivery
  };
}

function normalizePositiveInteger(value, fallback = 1) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  if (users[email]) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  users[email] = { name, email, password };
  res.status(201).json({ success: true, message: 'Registration successful', user: { name, email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
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
  
  const total = filtered.length;
  if (req.query.limit) {
    const limit = normalizePositiveInteger(req.query.limit, total);
    filtered = filtered.slice(0, limit);
  }
  
  res.json({ success: true, products: filtered, total });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number.parseInt(req.params.id, 10));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  
  res.json({ success: true, product });
});

// ==================== CART ROUTES ====================

app.post('/api/cart/add', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';

  const productId = Number.parseInt(req.body.productId, 10);
  const quantity = normalizePositiveInteger(req.body.quantity);
  const product = products.find(p => p.id === productId);
  
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  
  if (!carts[userEmail]) carts[userEmail] = [];
  
  const existingItem = carts[userEmail].find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[userEmail].push({ ...product, quantity });
  }
  
  const cart = getCartWithTotals(userEmail);
  res.status(201).json({ success: true, message: 'Item added to cart', cart });
});

app.get('/api/cart', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';
  const cart = getCartWithTotals(userEmail);
  res.json({ success: true, cart });
});

app.put('/api/cart/update', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';

  const productId = Number.parseInt(req.body.productId, 10);
  const quantity = Number.parseInt(req.body.quantity, 10);
  if (!carts[userEmail]) carts[userEmail] = [];
  
  const item = carts[userEmail].find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      carts[userEmail] = carts[userEmail].filter(i => i.id !== productId);
    }
  }
  
  const cart = getCartWithTotals(userEmail);
  res.json({ success: true, message: 'Cart updated', cart });
});

app.delete('/api/cart/remove/:productId', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';

  carts[userEmail] = (carts[userEmail] || []).filter(item => item.id !== Number.parseInt(req.params.productId, 10));
  const cart = getCartWithTotals(userEmail);
  
  res.json({ success: true, message: 'Item removed from cart', cart });
});

app.delete('/api/cart/clear', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';
  carts[userEmail] = [];
  res.json({ success: true, message: 'Cart cleared' });
});

// ==================== PAYMENT ROUTES ====================

app.post('/api/payment/process', (req, res) => {
  const { cardNumber, expiry, cvc, amount } = req.body;
  
  if (!cardNumber || !expiry || !cvc) {
    return res.status(400).json({ success: false, message: 'Payment details are missing' });
  }

  // Simulate processing delay
  setTimeout(() => {
    res.json({ 
      success: true, 
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      message: 'Payment successful' 
    });
  }, 1500);
});

// ==================== ORDERS ROUTES ====================

app.post('/api/orders/create', (req, res) => {
  const userEmail = req.headers['user-email'] || 'guest';
  
  const { deliveryAddress, phone, paymentId } = req.body;
  const cartItems = carts[userEmail] || [];
  
  if (cartItems.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }
  
  const items = cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price }));
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.05);
  const delivery = 50;
  const total = subtotal + tax + delivery;
  
  const order = {
    id: 'ORD-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
    userEmail,
    items,
    subtotal,
    tax,
    delivery,
    total,
    status: 'confirmed',
    paymentId,
    deliveryAddress,
    phone,
    createdAt: new Date().toISOString(),
    estimatedDelivery: '30 minutes',
    timeline: [
      { status: 'confirmed', time: new Date().toISOString() }
    ]
  };
  
  orders.push(order);
  carts[userEmail] = []; // Clear cart after order
  
  res.status(201).json({ success: true, message: 'Order placed successfully', order });
});

app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders, total: orders.length });
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
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue),
      todayOrders: todayOrders.length,
      todayRevenue: Math.round(todayOrders.reduce((sum, o) => sum + o.total, 0)),
      averageOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
      activeCarts: Object.values(carts).filter(items => items.length > 0).length
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

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GroceryHub Backend running on http://localhost:${PORT}`);
});
