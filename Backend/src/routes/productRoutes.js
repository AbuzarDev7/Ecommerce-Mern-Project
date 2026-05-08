const express = require('express');
const router = express.Router();
const {
    getProducts,
    getMyProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.get('/my', protect, admin, getMyProducts);
router
    .route('/:id')
    .get(getProductById)
    .delete(protect, admin, deleteProduct)
    .put(protect, admin, updateProduct);

module.exports = router;
