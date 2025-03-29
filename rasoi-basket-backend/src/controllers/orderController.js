const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      seller,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
      seller,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email mobile')
      .populate('seller', 'name email')
      .populate('deliveryAgent', 'name mobile');

    // Check if order exists and the user is authorized to view it
    if (order) {
      const isAuthorized =
        order.user._id.toString() === req.user._id.toString() ||
        req.user.role === 'admin' ||
        (req.user.role === 'seller' && order.seller._id.toString() === req.user._id.toString()) ||
        (req.user.role === 'delivery' && order.deliveryAgent && order.deliveryAgent._id.toString() === req.user._id.toString());

      if (isAuthorized) {
        res.json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller/Admin/Delivery
const updateOrderStatus = async (req, res) => {
  try {
    const { status, estimatedDeliveryTime } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Validate if the user has permission to update the order status
      const isSeller = req.user.role === 'seller' && order.seller.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';
      const isDelivery = req.user.role === 'delivery' && order.deliveryAgent && order.deliveryAgent.toString() === req.user._id.toString();

      if (isSeller || isAdmin || isDelivery) {
        order.status = status || order.status;
        
        if (estimatedDeliveryTime) {
          order.estimatedDeliveryTime = estimatedDeliveryTime;
        }

        // If status is delivered, update the isDelivered field
        if (status === 'delivered') {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(401).json({ message: 'Not authorized to update this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign delivery agent to order
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private/Admin/Seller
const assignDeliveryAgent = async (req, res) => {
  try {
    const { deliveryAgentId } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Validate if the user has permission to assign delivery agent
      const isSeller = req.user.role === 'seller' && order.seller.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (isSeller || isAdmin) {
        order.deliveryAgent = deliveryAgentId;
        order.status = 'out_for_delivery';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(401).json({ message: 'Not authorized to assign delivery agent' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seller orders
// @route   GET /api/orders/seller
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('user', 'name mobile')
      .populate('deliveryAgent', 'name mobile')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery agent orders
// @route   GET /api/orders/delivery
// @access  Private/Delivery
const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryAgent: req.user._id,
      status: { $in: ['out_for_delivery', 'delivered'] } 
    })
      .populate('user', 'name mobile address')
      .populate('seller', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name')
      .populate('seller', 'name')
      .populate('deliveryAgent', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  assignDeliveryAgent,
  getMyOrders,
  getSellerOrders,
  getDeliveryOrders,
  getOrders,
}; 