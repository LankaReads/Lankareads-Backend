// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            email,
            password
        });

        // Save user to the database
        await user.save();

        // Generate token and return it
        const token = generateToken(user._id);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Login existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
};
