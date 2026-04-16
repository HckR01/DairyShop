
const mongoose = require("mongoose")


// Connection URL



//connection
const connectDB = async () => {
    await mongoose.connect(process.env.URI);
}
module.exports = connectDB;