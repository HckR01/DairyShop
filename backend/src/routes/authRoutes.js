const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, deleteUser,logoutUser} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
//apis anme to handel
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUser);
router.post('/logout', protect, logoutUser);
module.exports = router;