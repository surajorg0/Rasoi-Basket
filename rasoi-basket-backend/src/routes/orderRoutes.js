const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  assignDeliveryAgent,
  getMyOrders,
  getSellerOrders,
  getDeliveryOrders,
  getOrders,
} = require('../controllers/orderController');
const { protect, admin, seller, delivery } = require('../middlewares/authMiddleware');

// Private routes (for authenticated users)
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);

// Seller routes
router.route('/seller').get(protect, seller, getSellerOrders);

// Delivery agent routes
router.route('/delivery').get(protect, delivery, getDeliveryOrders);

// Admin routes
router.route('/').get(protect, admin, getOrders);

// Shared routes with access control
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, updateOrderStatus);
router.route('/:id/assign-delivery').put(
  protect,
  (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'seller') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  },
  assignDeliveryAgent
);

module.exports = router; 