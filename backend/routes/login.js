const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ message: 'User does not exist' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token
    const token = jwt.sign({ email: user[0].email, isAdmin: user[0].isAdmin  }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token,user: {
        id: user.id,
        email: user.email,
        fullName: user[0].fullName,
        isAdmin: user[0].isAdmin,
      }, });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
