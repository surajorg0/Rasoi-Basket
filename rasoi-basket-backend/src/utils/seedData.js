const User = require('../models/userModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding data');

    // Add default users
    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'suraj@admin.com',
        password: '12345',
        mobile: '1234567890',
        role: 'admin',
        address: {
          street: '123 Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          postalCode: '123456',
        },
      },
      {
        name: 'Regular User',
        email: 'suraj@user.com',
        password: '12345',
        mobile: '2345678901',
        role: 'user',
        address: {
          street: '456 User Street',
          city: 'User City',
          state: 'User State',
          postalCode: '234567',
        },
      },
      {
        name: 'Seller User',
        email: 'suraj@seller.com',
        password: '12345',
        mobile: '3456789012',
        role: 'seller',
        address: {
          street: '789 Seller Street',
          city: 'Seller City',
          state: 'Seller State',
          postalCode: '345678',
        },
      },
      {
        name: 'Delivery User',
        email: 'suraj@delivery.com',
        password: '12345',
        mobile: '4567890123',
        role: 'delivery',
        address: {
          street: '101 Delivery Street',
          city: 'Delivery City',
          state: 'Delivery State',
          postalCode: '456789',
        },
      },
    ];

    // Check if users already exist
    for (const userData of defaultUsers) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        await User.create(userData);
        console.log(`Created user: ${userData.email}`);
      } else {
        console.log(`User ${userData.email} already exists`);
      }
    }

    // Get seller user ID for sample products
    const sellerUser = await User.findOne({ email: 'suraj@seller.com' });

    if (sellerUser) {
      // Sample products data
      const sampleProducts = [
        {
          name: 'Fresh Tomatoes',
          description: 'Organic farm-fresh tomatoes',
          image: 'https://example.com/images/tomatoes.jpg',
          category: 'vegetables',
          price: 20,
          discountPercentage: 5,
          stockQuantity: 100,
          seller: sellerUser._id,
          unit: 'kg',
        },
        {
          name: 'Red Apples',
          description: 'Sweet and juicy red apples',
          image: 'https://example.com/images/apples.jpg',
          category: 'fruits',
          price: 40,
          discountPercentage: 0,
          stockQuantity: 80,
          seller: sellerUser._id,
          unit: 'kg',
        },
        {
          name: 'Basmati Rice',
          description: 'Premium quality aged basmati rice',
          image: 'https://example.com/images/rice.jpg',
          category: 'groceries',
          price: 80,
          discountPercentage: 10,
          stockQuantity: 50,
          seller: sellerUser._id,
          unit: 'kg',
        },
      ];

      // Add sample products
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        await Product.insertMany(sampleProducts);
        console.log('Sample products added to the database');
      } else {
        console.log('Products already exist in the database');
      }
    }

    console.log('Data seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 