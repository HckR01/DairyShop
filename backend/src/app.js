//db file ................
require('dotenv').config();

require("./config/database");
const express = require('express');

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
    res.send("Hello !");
});
app.get("/user",(req,res)=>{
    res.send(" GEt User page");
})
app.post("/user",(req,res)=>{
    res.send("POST User page");
})

app.delete("/user",(req,res)=>{
    res.send("DELETE User page");
})

 