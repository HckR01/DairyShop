const express = require('express');
const router = express.Router();
const { getDashboardStats,getAllOrders,updateOrderStatus,getDeliverySheet,getAllSubscriptions } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware'); 

router.get('/stats', protect, admin, getDashboardStats);
//admine dashboard ke lia
router.get('/orders', protect, admin, getAllOrders);
router.put('/order/:id/status', protect, admin, updateOrderStatus);

router.get('/delivery-sheet', protect, admin, getDeliverySheet);
router.get('/subscriptions', protect, admin, getAllSubscriptions);
module.exports = router;