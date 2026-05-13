const Order = require('../models/Order');
const Product = require('../models/Product');


const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    }

    // Check stock availability for each item before placing order
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product not found: ${item.title}`);
            return;
        }
        if (product.stock < item.qty) {
            res.status(400);
            throw new Error(`Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.qty}`);
            return;
        }
    }

    // Deduct stock and increment soldStock for each ordered item
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.qty, soldStock: item.qty } },
            { new: true }
        );
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        isDelivered: false
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};


// @route   GET /api/orders/:id

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};


// @route   PUT /api/orders/:id/pay

const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @route   PUT /api/orders/:id/deliver
const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};


// @route   GET /api/orders/myorders

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    // In a multi-vendor, this could be filtered, but for simple admin let's return all.
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};


module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getAllOrders
};
