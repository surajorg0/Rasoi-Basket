const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).populate('seller', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin/Seller
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the seller of the product or an admin
      if (
        (req.user.role === 'seller' && 
         product.seller.toString() === req.user._id.toString()) || 
        req.user.role === 'admin'
      ) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
      } else {
        res.status(401).json({ message: 'Not authorized to delete this product' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      discountPercentage,
      stockQuantity,
      unit,
    } = req.body;

    const product = new Product({
      name,
      description,
      image,
      category,
      price,
      discountPercentage,
      stockQuantity,
      unit,
      seller: req.user._id,
      isAvailable: true,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      category,
      price,
      discountPercentage,
      stockQuantity,
      isAvailable,
      unit,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the user is the seller of the product or an admin
      if (
        (req.user.role === 'seller' && 
         product.seller.toString() === req.user._id.toString()) || 
        req.user.role === 'admin'
      ) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
        product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
        product.isAvailable = isAvailable !== undefined ? isAvailable : product.isAvailable;
        product.unit = unit || product.unit;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(401).json({ message: 'Not authorized to update this product' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller products
// @route   GET /api/products/seller
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getSellerProducts,
}; 