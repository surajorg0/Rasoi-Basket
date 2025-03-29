const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
require('dotenv').config();

// Set up global variables
let isMongoConnected = false;

// Connect to MongoDB
const initServer = async () => {
  try {
    // Attempt to connect to MongoDB
    isMongoConnected = await connectDB();
    
    const app = express();

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.json());

    // Add connection status middleware
    app.use((req, res, next) => {
      req.isMongoConnected = isMongoConnected;
      next();
    });

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);

    // Home route
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Welcome to Rasoi Basket API',
        mongoStatus: isMongoConnected ? 'connected' : 'disconnected'
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      res.status(statusCode);
      res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
      });
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`MongoDB Status: ${isMongoConnected ? 'Connected' : 'Using Mock Data'}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
};

// Start the server
initServer(); 