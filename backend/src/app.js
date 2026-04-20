//db file ................
require('dotenv').config();
const connectDB = require("./config/database");
//modulesimport
const express = require('express');
//file import........................................
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subRoutes = require('./routes/subRoutes');
//.........................................................
const app = express();
app.use(express.json());
//api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subRoutes);


//db connection & server start.............
connectDB().then(()=>{
    console.log("db connected");
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
}).catch(err=>{
    console.error("db not connect")
})
//....................................

