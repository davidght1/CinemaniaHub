const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protectAdmin = asyncHandler(async (req,res,next)=>{
    try{
        let token;

        // Check for token in cookies first
        if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        }

        // If token is not found in cookies, check headers
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
        }

        if(!token){
            res.status(401)
            return res.json({message: 'Not authorized please login'})
        }

        //verified token
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        
        // get user id from token
        const user = await User.findById(verified.id).select("-password")
        if(!user){
            res.status(401)
            return res.json({message: 'User not found'})
        }
        //check user role
        if(user.userRole !== 'admin'){
            res.status(401)
            return res.json({message: "You do not have permission to get here"})
        }
        //send back the user
        req.user = user
        next()
    }catch(error){
        res.status(401)
        return res.json({message: 'Not authorized, please login'})
    }
})

module.exports = protectAdmin