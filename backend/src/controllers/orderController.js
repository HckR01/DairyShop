const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // 1. Cart search
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart khali hai" });
        }

        // 2. Order Create 
        const deliveryFee = cart.totalPrice >= 300 ? 0 : 40;
        const order = new Order({
            user: req.user._id,
            orderItems: cart.items,
            shippingAddress,
            paymentMethod,
            totalPrice: cart.totalPrice + deliveryFee,
        });

        const createdOrder = await order.save();

        
        await User.findByIdAndUpdate(req.user._id, {
            address: `${shippingAddress.street}, ${shippingAddress.city} - ${shippingAddress.pincode}`
        });

        
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(201).json({
            message: "Order successful aur address save ho gaya!",
            order: createdOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        
        if (!order) {
            return res.status(404).json({ message: "Order nahi mila" });
        }

        // Ensuring that a user can only view their own order OR admin views it
        const orderUserId = order.user ? order.user._id.toString() : null;
        
        if (req.user.role !== 'admin' && orderUserId !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorised access" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
};