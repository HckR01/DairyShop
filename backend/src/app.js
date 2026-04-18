//db file ................
require('dotenv').config();
const connectDB = require("./config/database");
//modulesimport
const express = require('express');
//file import
const authRoutes = require('./routes/authRoutes');
const User = require('./models/User');
const app = express();
app.use(express.json());
//api
app.use('/api/auth', authRoutes);


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

