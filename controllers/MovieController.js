const asyncHandler = require("express-async-handler");

// --- for all ---

// Get all movies 
const getAllMovies = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'get all movies'})
})


// Get single movies 
const getSingleMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'get single movie'})
})

// --- for users only --- 

// Patch vote on a single movie
const updateVoteMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'vote updated'})
})


// Patch rating on a single movie
const updateRatingMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'rating updated'})
})

// Patch post commends
const updateCommendsMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'commend updated'})
})

// Post movie
const createMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'movie created'})
})

// Patch movie details
const updateMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'movie updated'})
})

// Delete movie
const deleteMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'movie deleted'})
})


// Get movie stats for cinema owners
const getMovieStats = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'movie details for cinema owner'})
})


module.exports = {
    getAllMovies,
    getSingleMovie,
    updateMovie,
    updateRatingMovie,
    updateVoteMovie,
    createMovie,
    deleteMovie,
    updateCommendsMovie,
    getMovieStats
}