const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to authenticate user token
const protect = async (req, res, next) => {
  let token;

  // Check if MongoDB is connected
  if (!req.isMongoConnected) {
    // If using mock data, handle demo tokens
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Set mock user based on id
        if (decoded.id === '1') {
          req.user = {
            _id: '1',
            name: 'Suraj Admin',
            email: 'suraj@admin.com',
            role: 'admin',
          };
        } else if (decoded.id === '2') {
          req.user = {
            _id: '2',
            name: 'Suraj User',
            email: 'suraj@user.com',
            role: 'user',
          };
        } else if (decoded.id === '3') {
          req.user = {
            _id: '3',
            name: 'Suraj Seller',
            email: 'suraj@seller.com',
            role: 'seller',
          };
        } else if (decoded.id === '4') {
          req.user = {
            _id: '4',
            name: 'Suraj Delivery',
            email: 'suraj@delivery.com',
            role: 'delivery',
          };
        } else {
          // Handle custom mock users (from registration)
          req.user = {
            _id: decoded.id,
            name: 'New User',
            email: 'newuser@example.com',
            role: 'user',
          };
        }
        
        console.log('Using mock user for authentication:', req.user);
        return next();
      } catch (error) {
        console.error('Mock token verification error:', error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  }

  // Real MongoDB authentication
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware to check if user is seller
const seller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};

// Middleware to check if user is delivery agent
const delivery = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a delivery agent' });
  }
};

module.exports = { protect, admin, seller, delivery }; 