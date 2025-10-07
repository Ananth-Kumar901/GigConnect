const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get logged-in user profile
router.get('/me', authMiddleware, getProfile);

// Update logged-in user profile
router.patch('/me', authMiddleware, updateProfile);

module.exports = router;
