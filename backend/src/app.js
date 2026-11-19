//db file ................
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
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
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      // Allow localhost, 127.0.0.1, LAN IPs, Vercel deployments, or all in dev
      if (
        process.env.NODE_ENV !== "production" ||
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname)
      ) {
        return callback(null, true);
      }
      return callback(null, true);
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
