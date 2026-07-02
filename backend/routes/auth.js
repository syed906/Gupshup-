const express = require('express');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // TODO: Hash password and save to database
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Verify credentials and return JWT token
    res.json({ message: 'Login successful', token: 'your_jwt_token' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
