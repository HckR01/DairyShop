
const mongoose = require("mongoose")


// Connection URL



//connection
const connectDB =async()=>{
    mongoose.connect(process.env.URI);
    
}

connectDB().then(()=>{
    console.log("db connected")
}).catch(err=>{
    console.error("db not connect")
})