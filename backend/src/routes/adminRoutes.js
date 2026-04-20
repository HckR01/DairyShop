const express = require('express');
const router = express.Router();
const { getDashboardStats,getAllOrders,updateOrderStatus } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); 

router.get('/stats', protect, admin, getDashboardStats);
//admine dashboard ke lia
router.get('/orders', protect, admin, getAllOrders);
router.put('/order/:id/status', protect, admin, updateOrderStatus);
module.exports = router;