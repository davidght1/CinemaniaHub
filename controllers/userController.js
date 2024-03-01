const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
// register user controller 
const registerUser = asyncHandler(async (req,res)=>{
    const { name, email, password } = req.body;

    try {
        // Check if the fields are not empty and perform other validations
        if (!name || !email || !password) {
            res.status(400);
            return res.json({ error: "Please fill all required fields" });
        }
    
        // Check if the password is at least 6 characters
        if (password.length < 6) {
            res.status(400);
            return res.json({ error: "Password must be at least 6 characters" });
        }
    
        // Check if the email exists
        const userExists = await User.findOne({ email });
    
        if (userExists) {
            res.status(400);
            return res.json({ error: "Email has already been registered" });
        }
    
        // If all pass, create a new user
    
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
    
        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });
    
        // Create and sign a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
        // Set the token as an HttpOnly cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    
        res.status(201).json({
            message: 'user has been created',
            userId: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors, specifically for the email field
            if (error.errors.email) {
                res.status(400);
                return res.json({ error: 'Invalid email format' });
            }
            // Handle other validation errors if needed
            res.status(400);
            return res.json({ error: 'Validation error' });
        } else {
            // Handle other errors
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})

// login user controller 
const loginUser = asyncHandler(async (req,res)=>{
    try{
        const {email,password} = req.body

        // Check for unexpected properties in the request body
        const unexpectedProperties = Object.keys(req.body).filter(prop => prop !== 'email' && prop !== 'password');

        if (unexpectedProperties.length > 0) {
            res.status(400);
            return res.json({ error: 'Unexpected properties in the request body' });
        }
        
        // validate data 
        if(!email || !password){
            res.status(400)
            return res.json({error: "Please fill all required fields"})
        }

        //check if email exists
        const user = await User.findOne({email})

        if(!user){
            res.status(400)
            return res.json({error: "This email is not exists in our site Please register first"})
        }

        //user exists compare the passwords
        const passwordCorrect = await bcrypt.compare(password, user.password)
        
        //generate token for the user 
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, { expiresIn: '1h' })

        // if user exists and password is correct we logged in the user
        if(user && passwordCorrect){
            // send token
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            // send user details
            res.status(200).json({
                message: 'user has been logged in',
                userId: user._id,
                email: user.email,
            })

        }
        else{
            res.status(400)
            return res.json({message: "invalid email or password"})
        }


    }catch(error){
        if (error.name === 'ValidationError') {
            // Handle other validation errors if needed
            res.status(400);
            return res.json({ error: 'Validation error' });
        } else {
            // Handle other errors
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

})

// logout user controller
const logoutUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'logout user'})
})

// login status user controller
const loginStatus = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'login status'})
})



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    loginStatus
}