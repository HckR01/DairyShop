//db file ................
require('dotenv').config();
const connectDB = require("./config/database");
//modulesimport
const express = require('express');
//file import
const User = require('./models/User');
const app = express();
app.use(express.json());
//api
app.post("/signup",async(req,res)=>{
    const user = new User(req.body);



    try{
        await user.save();
        res.send("user added")
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
    
})




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

