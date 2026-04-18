const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        default: 0
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ['Milk', 'Paneer', 'Ghee', 'Curd', 'Butter', 'Other'], 
        default: 'Milk'
    },
    unit: {
        type: String,
        required: [true, "Unit is required (e.g., Litre, Kg, Packet)"],
        enum: ['Litre', 'Kg', 'Packet', 'Gram'],
        default: 'Litre'
    },
    stock: {
        type: Number,
        required: [true, "Stock count is required"],
        default: 0
    },
    imageUrl: {
        type: String,
        default: "https://via.placeholder.com/150" 
    },
    isSubscriptionAvailable: {
        type: Boolean,
        default: false 
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;