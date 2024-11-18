const express = require('express');
const User = require('../models/User');  // Ensure User model is imported
const { registerUser, loginUser, googleLoginUser } = require('../controllers/authController');
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Google login route
// router.post('/google-login', googleLoginUser);

// Route to fetch all users (for admin)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// Route to delete a user
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id); // Delete user by ID
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

module.exports = router;
