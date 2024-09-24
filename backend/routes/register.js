const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { fullName,email, password, mobile, business_name } = req.body ;
 console.log(req.body);
  try {
    // Check if user already exists
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    await db.query('INSERT INTO users (email, password, fullName, mobile, business_name ) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, fullName, mobile, business_name]);

    // Create JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
});

module.exports = router;
