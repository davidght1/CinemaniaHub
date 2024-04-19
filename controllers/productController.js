require('dotenv').config();
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel')
const Product = require('../models/productsModel')
const cloudinary  = require("cloudinary").v2

// setup cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
 });



 // create product
 const createProduct = asyncHandler(async (req,res)=>{
    try {
        const { name, price } = req.body;

        // Check if all fields exist
        if (!name || !price) {
            return res.status(400).json({ message: "Please fill all required fields to create a product" });
        }

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a picture for the product" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create new product
        const newProduct = new Product({
            name: name,
            price: price,
            pictureUrl: result.secure_url
        });

        // Save product to the database
        await newProduct.save();

        res.status(201).json({ message: "Product created", data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    }
 })

 // get all product
 const getAllProducts = asyncHandler(async (req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({ products: products });
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    }
 })
 
  // buy product
  const buyProduct = asyncHandler(async (req,res)=>{
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has enough coins
        if (user.coins < product.price) {
            return res.status(400).json({ message: "Not enough coins to buy this product" });
        }

        // Generate random coupon number
        const couponNumber = Math.floor(Math.random() * 10000);

        // Deduct product price from user's coins
        user.coins -= product.price;

        // Save updated user information
        await user.save();

        res.status(200).json({ message: "Product purchased successfully", coupon: couponNumber, updatedCoins: user.coins});
    } catch (error) {
        console.error("Error buying product:", error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    }
  })


  module.exports = {
    createProduct,
    buyProduct,
    getAllProducts
  }