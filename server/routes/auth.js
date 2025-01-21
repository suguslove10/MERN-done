import express from 'express';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register vendor
router.post('/register', async (req, res) => {
  try {
    const { storeName, email, password } = req.body;
    
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const vendor = new Vendor({ storeName, email, password });
    await vendor.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed' });
  }
});

// Login vendor
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      vendor: {
        _id: vendor._id,
        storeName: vendor.storeName,
        email: vendor.email,
        createdAt: vendor.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed' });
  }
});

// Get vendor profile
router.get('/me', auth, async (req, res) => {
  try {
    const vendor = req.vendor;
    res.json({
      _id: vendor._id,
      storeName: vendor.storeName,
      email: vendor.email,
      createdAt: vendor.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;