const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions } = require('../controllers/subController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubscription);
router.get('/my', protect, getMySubscriptions);

module.exports = router;