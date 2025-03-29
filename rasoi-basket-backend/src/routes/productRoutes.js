const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getSellerProducts,
} = require('../controllers/productController');
const { protect, admin, seller } = require('../middlewares/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Private routes
router.route('/seller/products').get(protect, seller, getSellerProducts);

router.route('/')
  .post(protect, seller, createProduct);

router.route('/:id')
  .delete(protect, seller, deleteProduct)
  .put(protect, seller, updateProduct);

module.exports = router; 