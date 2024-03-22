require('dotenv').config();
const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel")
const cloudinary  = require("cloudinary").v2

// setup cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
 });



// --- for all ---

// Get all movies 
const getAllMovies = asyncHandler(async (req,res)=>{
    try{
        const movies = await Movie.find();

        res.status(200).json({message: "Get all movies", data: movies})
    }
    catch(error){
        res.status(500).json({ message: "Something went wrong please try again later"});
    }

})


// Get single movies 
const getSingleMovie = asyncHandler(async (req,res)=>{
    try{
        const {_id} = req.params
        const movie = await Movie.findOne(_id);

        res.status(200).json({message: "Get all movies", data: movie})
    }
    catch(error){
        res.status(500).json({ message: "Something went wrong please try again later"});
    }
})

// --- for users only --- 

// Patch vote on a single movie
const updateVoteMovie = asyncHandler(async (req,res)=>{
    res.status(200).json({message: 'vote updated'})
})


// Patch rating on a single movie
const updateRatingMovie = asyncHandler(async (req,res)=>{
    try{
        const movieId = req.params.id
        const userId = req.user._id
        console.log(movieId)
        // check if movie exists
        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({message: 'Movie not found'})
        }

        // Check if the user has already rated this movie
        const existingRatingIndex = movie.ratings.findIndex(rating => rating.userId.equals(userId));
        if (existingRatingIndex !== -1) {
        return res.status(400).json({ message: "User has already rated this movie" });
        }

        // Validate user input
        const userRating = parseInt(req.body.rating);
        if (isNaN(userRating) || userRating < 1 || userRating > 5) {
        return res.status(400).json({ message: "Invalid rating. Rating must be between 1 and 5" });
        }

        // Add the new rating
        movie.ratings.push({
        userId: userId,
        rating: userRating
        });

        // Save the updated movie
        await movie.save();

        res.json({ message: "Rating added successfully" });
    }
    catch(error){
        return res.status(500).json({ message: "Something went wrong please try again later" });
    }
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
    if(!title || !description || !genre){
        return res.status(400).json({message: "Please fill all required fields to create movie"})
    }

    // check if file exists
    if(!req.file){
        return res.status(400).json({message: "Please upload a picture for the movie"})
    }
    // where we want save the photo
    const folderName = "cinemaniahub"


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