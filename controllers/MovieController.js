const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel")
const cloudinary  = require("cloudinary").v2

// setup cloudinary
cloudinary.config({
    cloud_name: "dmjohqyxw",
    api_key: "461793583347939",
    api_secret: "CylryzpuacmRJ71sLHgRCeL0Fek"
})




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

// Create movie
const createMovie = asyncHandler(async (req,res)=>{
    try{
        const {title, description, genre} = req.body

    // check if all fields exists
    if(!title,!description,!genre){
        return res.status(400).json({message: "Please fill all required fields to create movie"})
    }

    // check if file exists
    if(!req.file){
        return res.status(400).json({message: "Please upload a picture for the movie"})
    }
    // where we want save the photo
    const folderName = "cinemaniahub"

    console.log(req.file.path)

    //Upload image to Cloudinary with the specified folder
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder:folderName,
    })



    const newMovie = new Movie({
        title,
        description,
        genre,
        pictureUrl: result.secure_url, // Use the secure_url from Cloudinary
      });

      await newMovie.save()

      res.status(201).json({message: "Movie created", data: newMovie})
    }catch(error){
        console.log("Error creating movie:",error)
        res.status(500).json({message: "Something went wrong please try again later"})
    }

})

// Update movie details
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