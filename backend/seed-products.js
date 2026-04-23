const mongoose = require('mongoose');

const products = [
  {
    name: "Farm Fresh Milk",
    price: 60,
    imageUrl: "/products/milk.jpg",
    category: "Milk",
    description: "Pure and fresh cow milk delivered straight from the farm. Rich in calcium and protein.",
    unit: "1 Liter",
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Organic Toned Milk",
    price: 55,
    imageUrl: "/products/toned-milk.jpg",
    category: "Milk",
    description: "Low-fat toned milk with all the goodness of regular milk. Perfect for health-conscious families.",
    unit: "1 Liter",
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Buffalo Milk",
    price: 75,
    imageUrl: "/products/buffalo-milk.jpg",
    category: "Milk",
    description: "Creamy and thick buffalo milk. Great for making paneer and sweets.",
    unit: "1 Liter",
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Fresh Cream",
    price: 120,
    imageUrl: "/products/cream.jpg",
    category: "Cream",
    description: "Rich and thick fresh cream. Perfect for desserts and coffee.",
    unit: "200ml",
    stock: 50,
    isAvailable: true,
    isSubscriptionAvailable: false,
  },
  {
    name: "Greek Yogurt",
    price: 90,
    imageUrl: "/products/yogurt.jpg",
    category: "Yogurt",
    description: "Thick and creamy Greek yogurt. High in protein and probiotics.",
    unit: "400g",
    stock: 50,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Natural Curd",
    price: 45,
    imageUrl: "/products/curd.jpg",
    category: "Yogurt",
    description: "Fresh homemade style curd. Perfect for daily consumption.",
    unit: "500g",
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Cottage Cheese (Paneer)",
    price: 180,
    imageUrl: "/products/paneer.jpg",
    category: "Cheese",
    description: "Fresh and soft cottage cheese. Perfect for Indian dishes.",
    unit: "200g",
    stock: 30,
    isAvailable: true,
    isSubscriptionAvailable: false,
  },
  {
    name: "Cheddar Cheese",
    price: 250,
    imageUrl: "/products/cheddar.jpg",
    category: "Cheese",
    description: "Aged cheddar cheese with rich flavor. Great for sandwiches and burgers.",
    unit: "200g",
    stock: 20,
    isAvailable: true,
    isSubscriptionAvailable: false,
  },
  {
    name: "Mozzarella Cheese",
    price: 220,
    imageUrl: "/products/mozzarella.jpg",
    category: "Cheese",
    description: "Stretchy mozzarella cheese. Perfect for pizzas and pasta.",
    unit: "200g",
    stock: 20,
    isAvailable: true,
    isSubscriptionAvailable: false,
  },
  {
    name: "Pure Ghee",
    price: 550,
    imageUrl: "/products/ghee.jpg",
    category: "Ghee & Butter",
    description: "Traditional cow ghee made from pure butter. Rich aroma and taste.",
    unit: "500ml",
    stock: 50,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Salted Butter",
    price: 150,
    imageUrl: "/products/butter.jpg",
    category: "Ghee & Butter",
    description: "Creamy salted butter. Perfect for bread and cooking.",
    unit: "200g",
    stock: 60,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Buttermilk",
    price: 35,
    imageUrl: "/products/buttermilk.jpg",
    category: "Beverages",
    description: "Refreshing spiced buttermilk. Great for digestion.",
    unit: "500ml",
    stock: 100,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Chocolate Milk",
    price: 50,
    imageUrl: "/products/chocolate-milk.jpg",
    category: "Beverages",
    description: "Delicious chocolate flavored milk. Kids favorite!",
    unit: "250ml",
    stock: 80,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Lassi (Sweet)",
    price: 45,
    imageUrl: "/products/lassi.jpg",
    category: "Beverages",
    description: "Traditional sweet lassi. Refreshing and nutritious.",
    unit: "300ml",
    stock: 70,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
  {
    name: "Flavored Yogurt (Mango)",
    price: 55,
    imageUrl: "/products/mango-yogurt.jpg",
    category: "Yogurt",
    description: "Creamy yogurt with real mango flavor. Perfect snack.",
    unit: "150g",
    stock: 40,
    isAvailable: true,
    isSubscriptionAvailable: false,
  },
  {
    name: "A2 Cow Milk",
    price: 85,
    imageUrl: "/products/a2-milk.jpg",
    category: "Milk",
    description: "Premium A2 protein milk from indigenous cows. Easy to digest.",
    unit: "1 Liter",
    stock: 50,
    isAvailable: true,
    isSubscriptionAvailable: true,
  },
];

mongoose.connect('mongodb+srv://sarojkumarbaral6338_db_user:Dairy1234@dairyfarm.z3ugoho.mongodb.net/User?appName=dairyfarm')
  .then(async () => {
    const Product = require('../backend/src/models/Product');
    
    // Clear existing products to prevent duplicates and remove the placeholder ones
    await Product.deleteMany({});
    console.log("Cleared old products");

    // Insert new products
    await Product.insertMany(products);
    console.log("Successfully seeded 16 products!");

    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to seed", err);
    process.exit(1);
  });
