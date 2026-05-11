const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');


// @route   GET /api/products

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});


// @route   GET /api/products/my

const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
});


// @route   GET /api/products/:id

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Only the owner admin can delete their own product
    if (product.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You can only delete your own products');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, category, stock } = req.body;

    // Get image URL from Cloudinary (Multer-Cloudinary adds 'path' to req.file)
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    if (!title || !price || !description || !category || !stock) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const product = new Product({
        title,
        price,
        user: req.user._id,
        imageUrl,
        category,
        stock,
        description
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @route   PUT /api/products/:id

const updateProduct = asyncHandler(async (req, res) => {
    const { title, price, description, imageUrl, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.price = price || product.price;
        product.description = description || product.description;
        product.imageUrl = imageUrl || product.imageUrl;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getMyProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
};
