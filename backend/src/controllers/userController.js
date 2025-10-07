const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        res.json(req.user); // Already excludes password in authMiddleware
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = ['name', 'email', 'skills', 'portfolio', 'serviceRate'];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
