const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity kam se kam 1 honi chahiye']
    },
    // Dairy app ke liye sabse important field
    frequency: {
        type: String,
        required: true,
        enum: ['Daily', 'Every Other Day', 'Weekly', 'Custom'],
        default: 'Daily'
    },
    // Kis din se doodh aana shuru hoga
    startDate: {
        type: Date,
        required: true
    },
    
    endDate: {
        type: Date
    },
    shippingAddress: {
        street: String,
        city: { type: String, default: 'Puri' },
        pincode: Number,
        phone: Number
    },
    status: {
        type: String,
        enum: ['Active', 'Paused', 'Cancelled', 'Expired'],
        default: 'Active'
    },
    
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);