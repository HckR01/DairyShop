//db file ................
require("dotenv").config();
const connectDB = require("./config/database");
//modulesimport
const express = require("express");
const cors = require("cors");
//file import........................................
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subRoutes = require("./routes/subRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
//.........................................................
const app = express();
const allowedOrigins = [
  "http://localhost:3000", // Next.js dev
  "http://localhost:5173", // Vite dev (if used)
  "http://localhost:5174",
  "http://192.168.31.174:3000",
  "http://192.168.137.1:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
//api
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

//db connection & server start.............
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    console.log("db connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("db not connect", err);
  });
//....................................
