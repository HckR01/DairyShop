const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart,updateCartQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addToCart); 
router.get('/', protect, getCart);  
router.delete('/:productId', protect, removeFromCart); 
router.put('/updateCartQuantity', protect, updateCartQuantity);

module.exports = router;