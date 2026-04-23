# PadmaDairy (formerly Dairycart)

Welcome to **PadmaDairy**, a complete end-to-end e-commerce platform for farm-fresh dairy products. This repository contains both the modern frontend web application and the robust backend API that powers it.

## 🏗️ Project Structure

This is a monorepo containing two main directories:

- `/dairy-e-cart-main` - The Frontend (Next.js & React)
- `/backend` - The Backend API (Node.js & Express)

## ✨ Platform Features

### Customer Experience
- **Modern UI/UX:** Responsive, mobile-first design built with Tailwind CSS and Next.js.
- **User Accounts:** Secure registration, login, and profile management with address saving.
- **Product Catalog:** Browse fresh dairy products, view categories, and add items to the cart.
- **Subscriptions:** "Subscribe & Save" feature for daily, weekly, or monthly recurring deliveries.
- **Checkout Flow:** Secure order placement with Cash on Delivery (COD) and Online Payment options.
- **Order Tracking:** Customers can view their order history and track delivery statuses.

### Admin Dashboard (Role-Based Access)
- **Business Analytics:** Real-time overview of total orders, revenue, subscribers, and users.
- **Order Management:** View all incoming orders and update delivery statuses (e.g., Pending -> Delivered).
- **Inventory Control:** Add new dairy products, manage stock levels, and delete outdated items.
- **Subscription Tracking:** Monitor active customer subscriptions.

---

## 💻 Frontend (`/dairy-e-cart-main`)

The frontend is a blazing-fast, server-side rendered React application.

### Technologies
- **Next.js (App Router)** - React framework for production
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful SVG icons
- **Context API** - Global state management for Authentication and Cart

### Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd dairy-e-cart-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Backend (`/backend`)

The backend is a secure and scalable REST API.

### Technologies
- **Node.js & Express.js** - Server architecture
- **MongoDB & Mongoose** - Database and Object Modeling
- **JSON Web Tokens (JWT)** - Secure authentication
- **Bcrypt.js** - Password hashing

### Setup Instructions
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

## 🔗 API Modules

- **Authentication (`/api/auth`)**: Login, Registration, Profile Updates, Role assignment.
- **Products (`/api/products`)**: Dynamic product fetching and inventory management.
- **Cart (`/api/cart`)**: Persistent user shopping carts.
- **Orders (`/api/orders`)**: Secure order processing and history tracking.
- **Subscriptions (`/api/subscriptions`)**: Management of recurring deliveries.
- **Admin (`/api/admin`)**: Aggregated analytics and protected administrative routes.
