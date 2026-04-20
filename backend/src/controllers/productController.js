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
        
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i', 
            },
        } : {};

        
        const category = req.query.category ? { category: req.query.category } : {};

        
        const products = await Product.find({ ...keyword, ...category });

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
//update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price || product.price;
            product.category = req.body.category || product.category;
            product.unit = req.body.unit || product.unit;
            product.stock = req.body.stock || product.stock;
            product.isSubscriptionAvailable = req.body.isSubscriptionAvailable !== undefined ? req.body.isSubscriptionAvailable : product.isSubscriptionAvailable;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//search product
const searchProductByName = async (req, res) => {
    try {
        const productName = req.params.name; 
        
        const products = await Product.find({
            name: { 
                $regex: productName, 
                $options: 'i' 
            }
        });

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: "Koi product is naam se nahi mila" });
        }
    } catch (error) {
        res.status(500).json({ message: "Search error", error: error.message });
    }
};
//get product by id

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product nahi mila" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { 
    
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    searchProductByName,
    getProductById 
};


