const Subscription = require('../models/Subscription');


const createSubscription = async (req, res) => {
    try {
        const { product, quantity, frequency, startDate, endDate, shippingAddress } = req.body;

        const subscription = new Subscription({
            user: req.user._id,
            product,
            quantity,
            frequency,
            startDate,
            endDate,
            shippingAddress
        });

        const createdSub = await subscription.save();

        res.status(201).json({
            message: "Subscription shuru ho gayi hai!",
            subscription: createdSub
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getMySubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find({ user: req.user._id }).populate('product', 'name price image');
        res.status(200).json(subs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createSubscription, getMySubscriptions };