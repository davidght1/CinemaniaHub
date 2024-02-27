const asyncHandler = require("express-async-handler");

// get all movies 
const getAllMovies = asyncHandler(async (req,res)=>{
    res.status("200").json({message: 'get all movies'})
})


// get single movies 
const getSingleMovie = asyncHandler(async (req,res)=>{
    res.status("200").json({message: 'get all movies'})
})