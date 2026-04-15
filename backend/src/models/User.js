const mongoose = require("mongoose");




const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please add a name"]
    },
    email:{
        type:String,
        required:[true,"please add a email"],
        unique: true,
        lowercase: true
    },
    password:{
        type:String,
        required:[true,"please add a password"]
    },
    addresses: [
        {
            street: String,
            city: { type: String, default: 'Puri' }, 
            pincode: Number,
            isDefault: { type: Boolean, default: false }
        }
    ],
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema);
module.exports = User;