# Dairycart Backend

Welcome to the backend service for **Dairycart**, a reliable and robust RESTful API built with Node.js, Express, and MongoDB.

## Technologies Used

- **Node.js & Express.js**: For creating the server and handling API routing.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT)**: For secure user authentication and route protection.
- **Bcrypt.js**: For hashing passwords to maintain user security.
- **Dotenv**: For environment variable management.

## 📦 Features

- User Authentication (Registration & Login).
- Secure password hashing.
- Protected routes using JWT Middleware.
- CRUD operations for user profiles.

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

_(Protected routes require a valid JWT token sent in the authorization header)_

---

Developed for the **Dairycart** application.
