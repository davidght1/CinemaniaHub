const asyncHandler = require("express-async-handler");


// register user controller 
const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'register yser'})
})

// login user controller 
const loginUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'login user'})
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