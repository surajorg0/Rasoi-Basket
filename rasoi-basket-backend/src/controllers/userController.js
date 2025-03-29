const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if MongoDB is connected
    if (!req.isMongoConnected) {
      // Use mock data if MongoDB is not connected
      console.log('MongoDB not connected, using mock data for login');
      
      // Return mock response for demo purposes
      if (email === 'suraj@admin.com' && password === '12345') {
        return res.json({
          _id: '1',
          name: 'Suraj Admin',
          email: 'suraj@admin.com',
          phone: '9876543210',
          role: 'admin',
          isApproved: true,
          status: 'active',
          token: generateToken('1'),
        });
      } else if (email === 'suraj@user.com' && password === '12345') {
        return res.json({
          _id: '2',
          name: 'Suraj User',
          email: 'suraj@user.com',
          phone: '9876543211',
          role: 'user',
          isApproved: true,
          status: 'active',
          token: generateToken('2'),
        });
      } else if (email === 'suraj@seller.com' && password === '12345') {
        return res.json({
          _id: '3',
          name: 'Suraj Seller',
          email: 'suraj@seller.com',
          phone: '9876543212',
          role: 'seller',
          isApproved: true,
          status: 'active',
          sellerInfo: {
            storeName: 'Suraj\'s Restaurant',
            storeAddress: '123 Main Street, Mumbai',
            businessRegNumber: 'B123456'
          },
          token: generateToken('3'),
        });
      } else if (email === 'suraj@delivery.com' && password === '12345') {
        return res.json({
          _id: '4',
          name: 'Suraj Delivery',
          email: 'suraj@delivery.com',
          phone: '9876543213',
          role: 'delivery',
          isApproved: true,
          status: 'active',
          deliveryInfo: {
            vehicleType: 'Motorcycle',
            licenseNumber: 'DL123456',
            area: ['South Mumbai', 'Andheri', 'Bandra']
          },
          token: generateToken('4'),
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is approved
    if (!user.isApproved) {
      return res.status(401).json({ 
        message: 'Your account is pending approval. Please wait for admin confirmation or contact support.' 
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({ 
        message: `Your account is currently ${user.status}. Please contact support for assistance.` 
      });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isApproved: user.isApproved,
      status: user.status,
      sellerInfo: user.sellerInfo,
      deliveryInfo: user.deliveryInfo,
      address: user.address,
      profileImage: user.profileImage,
      darkMode: user.darkMode,
      language: user.language,
      dateJoined: user.dateJoined,
      lastLogin: user.lastLogin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone,
      role,
      sellerInfo,
      deliveryInfo,
      address
    } = req.body;
    
    console.log('Registration request received:', { name, email, role });
    
    // Check if MongoDB is connected
    if (!req.isMongoConnected) {
      // Use mock data if MongoDB is not connected
      console.log('MongoDB not connected, using mock data for registration');
      
      // Return mock response for demo purposes
      const mockId = Math.floor(Math.random() * 1000) + 10;
      
      // Determine approval status based on role
      const isApproved = role === 'user';
      const status = role === 'user' ? 'active' : 'pending';
      
      const response = {
        _id: mockId.toString(),
        name,
        email,
        phone,
        role,
        isApproved,
        status,
        sellerInfo,
        deliveryInfo,
        address
      };
      
      if (isApproved) {
        response.token = generateToken(mockId.toString());
      }
      
      console.log('Mock registration response:', response);
      return res.status(201).json(response);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine approval status based on role
    const isApproved = role === 'user';
    const status = role === 'user' ? 'active' : 'pending';

    const userData = {
      name,
      email,
      password,
      phone,
      role: role || 'user',
      isApproved,
      status,
      address
    };

    // Add seller or delivery info if applicable
    if (role === 'seller' && sellerInfo) {
      userData.sellerInfo = sellerInfo;
    }

    if (role === 'delivery' && deliveryInfo) {
      userData.deliveryInfo = deliveryInfo;
    }

    console.log('Creating user in MongoDB:', userData);
    const user = await User.create(userData);

    if (user) {
      // Only include token if user is auto-approved (regular users)
      const response = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
        sellerInfo: user.sellerInfo,
        deliveryInfo: user.deliveryInfo,
      };

      if (user.isApproved) {
        response.token = generateToken(user._id);
      }

      console.log('User registered successfully:', response);
      res.status(201).json(response);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: user.isApproved,
        status: user.status,
        sellerInfo: user.sellerInfo,
        deliveryInfo: user.deliveryInfo,
        address: user.address,
        profileImage: user.profileImage,
        darkMode: user.darkMode,
        language: user.language,
        dateJoined: user.dateJoined,
        lastLogin: user.lastLogin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.darkMode = req.body.darkMode !== undefined ? req.body.darkMode : user.darkMode;
      user.language = req.body.language || user.language;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }

      // Update seller info if applicable
      if (user.role === 'seller' && req.body.sellerInfo) {
        user.sellerInfo = {
          ...user.sellerInfo,
          ...req.body.sellerInfo,
        };
      }

      // Update delivery info if applicable
      if (user.role === 'delivery' && req.body.deliveryInfo) {
        user.deliveryInfo = {
          ...user.deliveryInfo,
          ...req.body.deliveryInfo,
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isApproved: updatedUser.isApproved,
        status: updatedUser.status,
        sellerInfo: updatedUser.sellerInfo,
        deliveryInfo: updatedUser.deliveryInfo,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        darkMode: updatedUser.darkMode,
        language: updatedUser.language,
        dateJoined: updatedUser.dateJoined,
        lastLogin: updatedUser.lastLogin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending approval users
// @route   GET /api/users/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      isApproved: false, 
      status: 'pending' 
    }).select('-password');
    
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    user.status = 'active';

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isApproved: updatedUser.isApproved,
      status: updatedUser.status,
      role: updatedUser.role,
      message: 'User has been approved'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a user
// @route   PUT /api/users/:id/reject
// @access  Private/Admin
const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'rejected';
    user.rejectionReason = reason || 'Application did not meet our requirements';

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      status: updatedUser.status,
      role: updatedUser.role,
      message: 'User has been rejected'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.role = req.body.role || user.role;
      user.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : user.isApproved;
      user.status = req.body.status || user.status;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }

      // Update seller info if applicable
      if (req.body.sellerInfo) {
        user.sellerInfo = {
          ...user.sellerInfo,
          ...req.body.sellerInfo,
        };
      }

      // Update delivery info if applicable
      if (req.body.deliveryInfo) {
        user.deliveryInfo = {
          ...user.deliveryInfo,
          ...req.body.deliveryInfo,
        };
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        isApproved: updatedUser.isApproved,
        status: updatedUser.status,
        sellerInfo: updatedUser.sellerInfo,
        deliveryInfo: updatedUser.deliveryInfo,
        address: updatedUser.address,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  getUserById,
  updateUser,
}; 