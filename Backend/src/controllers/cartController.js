const Cart = require('../models/Cart');
const asyncHandler = require('express-async-handler');


const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');

    if (cart) {
        res.json(cart);
    } else {
        // Return empty cart if not found
        res.json({ cartItems: [] });
    }
});


const updateCart = asyncHandler(async (req, res) => {
    if (req.user.role === 'admin') {
        res.status(403);
        throw new Error('Admins are not allowed to perform this action');
    }

    const { cartItems } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });


    if (cart) {
        // Update existing cart
        cart.cartItems = cartItems;
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } else {
        // Create new cart
        const newCart = new Cart({
            user: req.user._id,
            cartItems
        });
        const createdCart = await newCart.save();
        res.status(201).json(createdCart);
    }
});

module.exports = {
    getCart,
    updateCart
};
