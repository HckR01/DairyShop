const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body; 
        const userId = req.user._id;

        
        const productData = await Product.findById(productId);
        if (!productData) {
            return res.status(404).json({ message: "Product nahi mila" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalPrice: 0 });
        }

        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            
            cart.items[itemIndex].quantity += Number(quantity);
        } else {    
            cart.items.push({ 
                product: productId, 
                name: productData.name, 
                quantity: Number(quantity), 
                price: productData.price, 
                image: productData.imageUrl 
            });
        }

        
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price category imageUrl');
        
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({ 
                message: "Cart khali hai", 
                items: [], 
                totalPrice: 0 
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart nahi mila" });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ message: "Item hata diya gaya", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart nahi mila" });

        const item = cart.items.find(p => p.product.toString() === productId);
        
        if (item) {
            
            if (quantity <= 0) {
                cart.items = cart.items.filter(p => p.product.toString() !== productId);
            } else {
                item.quantity = Number(quantity);
            }

            
            cart.totalPrice = cart.items.reduce((acc, i) => acc + i.quantity * i.price, 0);
            
            await cart.save();
            return res.status(200).json(cart);
        }

        res.status(404).json({ message: "Item cart mein nahi hai" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity
};