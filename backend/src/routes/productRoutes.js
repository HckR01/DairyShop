//admine lock 

const { admin } = require('../middleware/adminMiddleware');
//......
const express = require('express');
const router = express.Router();
const { getProducts, createProduct,updateProduct,deleteProduct,searchProductByName,getProductById } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', getProducts);
router.post('/', protect,admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
// Dedicated search route
router.get('/search/:name', searchProductByName);
//get product by id
router.get('/:id', getProductById);
module.exports = router;