# Dairycart Backend

Welcome to the backend service for **Dairycart**, a reliable and robust RESTful API built with Node.js, Express, and MongoDB.

## Technologies Used

- **Node.js & Express.js**: For creating the server and handling API routing.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT)**: For secure user authentication and route protection.
- **Bcrypt.js**: For hashing passwords to maintain user security.
- **Dotenv**: For environment variable management.

## 📦 Features

- **User Authentication:** Registration, login, profile management, and secure JWT-based route protection.
- **Product Management:** Full operations for dairy products with Admin privileges.
- **Shopping Cart:** Add products to cart and manage cart items.
- **Order Processing:** Place and manage user orders.
- **Subscriptions:** Support for recurring milk/dairy product deliveries.
- **Admin Management:** Dedicated routes for administrative controls and oversight.

## 🛠️ Installation & Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Install all dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root of your `backend` directory and add the following keys:

   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the server**
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description                     | Access    |
| ------ | ----------- | ------------------------------- | --------- |
| POST   | `/register` | Register a new user             | Public    |
| POST   | `/login`    | Login an existing user          | Public    |
| PUT    | `/profile`  | Update user profile information | Protected |
| DELETE | `/profile`  | Delete user account             | Protected |
| POST   | `/logout`   | Logout the user                 | Protected |

### Additional API Modules

- **Products (`/api/products`):** Endpoints for managing and retrieving dairy products.
- **Cart (`/api/cart`):** Endpoints for managing the shopping cart.
- **Orders (`/api/orders`):** Endpoints for creating and tracking orders.
- **Subscriptions (`/api/subscriptions`):** Endpoints for recurring dairy deliveries.
- **Admin (`/api/admin`):** Restricted endpoints for administrative operations.

_(Protected routes require a valid JWT token sent in the authorization header)_

---

Developed for the **Dairycart** application.
