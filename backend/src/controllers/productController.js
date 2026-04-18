// api i creeate here 
// /api/products      - get Get All Products
// /api/products/:id  - get Get Single Product
// /api/products      -post Add New Product
// /api/products/:id  - put Update Product
// /api/products/:id  - delete Delete Product

//file import
const Product = require('../models/Product');

//all product logic
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Create a product (Admin Only)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, unit, stock, isSubscriptionAvailable } = req.body;

        const product = new Product({
            name,
            description,
            price,
            category,
            unit,
            stock,
            isSubscriptionAvailable
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getProducts, createProduct };