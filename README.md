# 🛒 GroceryHub - Full Stack Setup & Hosting Guide

This project consists of a **Node.js/Express Backend** and a **Vanilla JS Frontend**.

---

## 💻 Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2. Backend Setup
```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Start the server
node server.js
```
The backend will be running at `http://localhost:5000`.

### 3. Frontend Setup
The frontend is a single HTML file. You can:
- Open `Frontend/groceryhub.html` directly in your browser.
- **Recommended:** Use a local development server (like VS Code's "Live Server" extension or `npx serve Frontend`) to avoid CORS issues if you change the API URL.

---

## 🚀 Hosting & Deployment

### Option 1: Render / Railway (Recommended for Backend)
These platforms are great for Node.js apps.

1.  **Push to GitHub:** Create a repository and push your code.
2.  **Connect to Platform:** Link your GitHub repo to [Render](https://render.com/) or [Railway](https://railway.app/).
3.  **Configure Service:**
    *   **Build Command:** `cd Backend && npm install`
    *   **Start Command:** `cd Backend && node server.js`
    *   **Environment Variable:** Add `PORT=10000` (or whatever the platform requires).
4.  **Update Frontend:** Once deployed, copy the provided URL (e.g., `https://my-api.onrender.com`) and update `API_URL` in `Frontend/groceryhub.html`.

### Option 2: Vercel / Netlify (Recommended for Frontend)
If you want to host the frontend separately:

1.  Upload `Frontend/groceryhub.html` to a new repo.
2.  Connect it to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
3.  Set the main file as the entry point.

### Important Deployment Notes:
- **CORS:** The current `server.js` uses `app.use(cors())`, which allows all origins. For production, you should restrict this to your frontend URL.
- **In-Memory Storage:** Since this is a "simple" backend, data is stored in memory. **Restarting the server will clear carts and orders.** For a permanent app, you would need to add a database like MongoDB or PostgreSQL.

---

## 🔌 API Endpoints Reference
| Feature | Endpoint | Method |
|---------|----------|--------|
| Health Check | `/api/health` | GET |
| Get Products | `/api/products` | GET |
| Add to Cart | `/api/cart/add` | POST |
| Create Order | `/api/orders/create` | POST |
| Get Cart | `/api/cart` | GET |
| Admin Stats | `/api/admin/stats` | GET |
