# PageTurner - Online Bookstore

A full-stack MERN bookstore application with authentication, admin book management, and shopping cart functionality.

---

# Features

## Authentication

- User registration and login
- JWT authentication
- Secure cookie-based sessions
- Protected routes
- Role-based authorization

---

# Books

- Browse all books
- Search by title or author
- Filter by category
- Sort by price, rating, and newest
- Pagination support
- Book detail page

---

# Cart

- Add books to cart
- Update quantity
- Remove items
- Clear cart
- Persistent user-specific cart

---

# Admin Features

- Add new books
- Update existing books
- Delete books
- Cloudinary image uploads

---

# Tech Stack

## Frontend

- React
- React Router
- Axios
- Context API
- Vite

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary

---

# Project Structure

```bash
frontend/
backend/
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your-repo-url>
```

---

## 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

# Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# Run Application

## Backend

```bash
npm run dev
```

## Frontend

```bash
npm run dev
```

---

# User Roles

## User

- Browse books
- Add to cart
- Place orders

## Admin

- Create books
- Update books
- Delete books

---

# API Routes

## Auth Routes

```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
GET  /api/auth/logout
```

---

## Book Routes

```bash
GET    /api/books
GET    /api/books/:id
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
```

---

## Cart Routes

```bash
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:bookId
DELETE /api/cart/:bookId
DELETE /api/cart
```

---

# Future Improvements

- Payment integration
- Wishlist
- Order history backend
- Admin dashboard analytics
- Email notifications
- Docker deployment
- CI/CD pipeline

---

# Author

Akshit Kumar
