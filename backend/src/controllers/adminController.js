const Order = require('../models/Order');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

//dashbord ke lia logic
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalSubs = await Subscription.countDocuments({ status: 'Active' });
        const totalUsers = await User.countDocuments();
        
        // Total Earning Calculate karo
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).json({
            totalOrders,
            totalSubs,
            totalUsers,
            totalRevenue: `₹${totalRevenue}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//all order delivery ke lia 
const getAllOrders = async (req, res) => {
    try {
        // Saare orders nikaalo, user ka naam aur email bhi saath mein (populate)
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // Latest orders sabse upar

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find({})
            .populate('user', 'name email')
            .populate('product', 'name price')
            .sort({ createdAt: -1 });
        res.status(200).json(subs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Product = require('../models/Product');

//Update order status (Pending to Delivered)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            
            // Deduct stock when the order is shipped (Out for Delivery) or Delivered
            if ((req.body.status === 'Out for Delivery' || req.body.status === 'Delivered') && !order.isStockDeducted) {
                for (const item of order.orderItems) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock = Math.max(0, product.stock - item.quantity);
                        await product.save();
                    }
                }
                order.isStockDeducted = true;
            }

            if (req.body.status === 'Delivered') {
                order.isPaid = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order nahi mila" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// get delivery sheet 
const getDeliverySheet = async (req, res) => {
    try {
        
        const date = req.query.date ? new Date(req.query.date) : new Date();
        
        
        const dailyOrders = await Order.find({
            status: 'Pending',
            createdAt: { 
                $gte: new Date(date.setHours(0,0,0,0)), 
                $lte: new Date(date.setHours(23,59,59,999)) 
            }
        }).populate('user', 'name phone');

       
        const activeSubscriptions = await Subscription.find({
            status: 'Active',
            startDate: { $lte: new Date() },
            $or: [{ endDate: { $gte: new Date() } }, { endDate: null }]
        }).populate('user', 'name phone').populate('product', 'name');

        res.status(200).json({
            date: date.toDateString(),
            oneTimeOrders: dailyOrders,
            recurringSubscriptions: activeSubscriptions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats,getAllOrders,updateOrderStatus,getDeliverySheet,getAllSubscriptions };