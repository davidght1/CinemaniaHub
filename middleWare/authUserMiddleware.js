const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protectUser = asyncHandler(async (req,res,next)=>{
    try{
        const token = req.cookies.token
        console.log(token)

        if(!token){
            res.status(401)
            return res.json({message: 'Not authorized please login'})
        }

        //verified token
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        // get user id from token
        console.log(verified.id)
        const user = await User.findById(verified.id).select("-password")
        if(!user){
            res.status(401)
            return res.json({message: 'User not found'})
        }
        console.log(user)
        if(user.userRole !== 'user'){
            res.status(401)
            return res.json({message: "You do not have permission to get here"})
        }
        req.user = user
        next()
    }catch(error){
        res.status(401)
        return res.json({message: 'Not authorized, please login'})
    }
})

module.exports = protectUser