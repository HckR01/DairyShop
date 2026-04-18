const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

//apis anme to handel
router.post('/register', registerUser);

module.exports = router;