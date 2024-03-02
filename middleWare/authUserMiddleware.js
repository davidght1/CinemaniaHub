const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protectUser = asyncHandler(async (req,res,next)=>{
    try{
        const token = req.cookies.token

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
        if(user.userRole !== 'user'){
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

module.exports = protectUser