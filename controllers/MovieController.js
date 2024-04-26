require('dotenv').config();
const asyncHandler = require("express-async-handler");
const Movie = require("../models/movieModel")
const User = require('../models/userModel')
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
        const movie = await Movie.findById(_id);
        res.status(200).json({message: "Get all movies", data: movie})
    }
    catch(error){
        res.status(500).json({ message: "Something went wrong please try again later"});
    }
})

// --- for users only --- 

// Patch vote on a single movie
const updateVoteMovie = asyncHandler(async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;
    const userChoices = req.body.choices;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if the user has already voted for this movie
    const existingVote = movie.userVotes.find(vote => vote.userId.equals(userId));
    if (existingVote) {
      return res.status(409).json({ message: "User has already voted for this movie" });
    }

    // Validate user input (choices)
    if (!userChoices || userChoices.length !== 3 || !userChoices.every(choice => choice >= 1 && choice <= 8)) {
      return res.status(400).json({ message: "Invalid choices. You must select exactly 3 choices from the predefined options (1 to 8)" });
    }

    // Add the new vote
    movie.userVotes.push({
      userId: userId,
      choices: userChoices
    });

    // Save the updated movie
    await movie.save();

    // Retrieve the user associated with the vote
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's votes count
    user.votes += 1;

    // Update user's coins based on their ratingUser
    let coinsEarned = 5; // Default coins earned per vote
    switch (user.ratingUser) {
      case 'bronze':
        coinsEarned = 10;
        break;
      case 'silver':
        coinsEarned = 15;
        break;
      case 'gold':
        coinsEarned = 20;
        break;
    }
    
    user.coins += coinsEarned;

    // Update user's ratingUser if necessary
    if (user.votes >= 5 && user.votes < 10) {
      user.ratingUser = 'bronze';
    } else if (user.votes >= 10 && user.votes < 15) {
      user.ratingUser = 'silver';
    } else if (user.votes >= 15) {
      user.ratingUser = 'gold';
    }

    // Save the updated user
    await user.save();

    // Respond with success and updated user data including coins
    res.status(201).json({
      message: "Vote saved successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        userRole: user.userRole,
        coins: user.coins  // Include the 'coins' field in the response
      }
    });
  } catch (error) {
    console.error("Error saving vote for movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Patch rating on a single movie
const updateRatingMovie = asyncHandler(async (req,res)=>{
    try{
        const movieId = req.params.id
        const userId = req.user._id
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
        
        res.status(200).json({ message: "Rating added successfully" });
    }
    catch(error){
        return res.status(500).json({ message: "Something went wrong please try again later" });
    }
})

// Patch post commends
const updateCommendsMovie = asyncHandler(async (req, res) => {
  try {
    const movieId = req.params.id;
    const userId = req.user._id;
    const newComment = req.body.content;

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Fetch user details to get the user's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add the new comment with user name
    movie.userPosts.push({
      userId: userId,
      userName: user.name,
      content: newComment
    });

    // Save the updated movie
    await movie.save();

    res.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error adding comment to movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- for admin only ---

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
const updateMovie = asyncHandler(async (req, res) => {
  try {
    const movieId = req.params.id;
    const { title, description, genre } = req.body;
    let pictureUrl;

    // Check if a new image was uploaded
    if (req.file) {
      // If a new photo is uploaded, upload it to Cloudinary or any storage service
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cinemaniahub',
      });
      pictureUrl = result.secure_url; // Store the secure_url from Cloudinary
    }

    // Find the movie by ID
    let movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update movie details
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.genre = genre || movie.genre;

    // If a new photo is provided, update the pictureUrl
    if (pictureUrl) {
      movie.pictureUrl = pictureUrl;
    }

    // Save the updated movie
    await movie.save();

    res.json({ message: 'Movie details updated successfully', updatedMovie: movie });
  } catch (error) {
    console.error('Error updating movie details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete movie
const deleteMovie = asyncHandler(async (req,res)=>{
    try {
        const movieId = req.params.id;
    
        // Check if the movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
          return res.status(404).json({ message: "Movie not found" });
        }
    
        // Delete the movie
        await movie.deleteOne();
    
        res.status(201).json({ message: "Movie deleted successfully" });
      } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Internal server error" });
      }
})

// --- for cinema users only ---

// Get movie stats for cinema owners
const getMovieStats = asyncHandler(async (req,res)=>{
    try {
        // Get all movies
        const movies = await Movie.find();
    
        // Calculate most chosen vote and total rating per movie
        const movieStats = movies.map(movie => {
          // Calculate total rating
          const totalRating = movie.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    
          // Calculate most chosen vote
          const voteCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
          movie.userVotes.forEach(vote => {
            vote.choices.forEach(choice => {
              if (choice >= 1 && choice <= 8) { 
                voteCount[choice - 1]++;
              }
            });
          });
    
          // Find the maximum count and corresponding vote
          const maxVoteCount = Math.max(...voteCount);
          const mostChosenVote = maxVoteCount > 0 ? voteCount.indexOf(maxVoteCount) + 1 : null;
    
          return {
            movieId: movie._id,
            title: movie.title,
            mostChosenVote: mostChosenVote,
            totalRating: totalRating
          };
        });
    
        res.json({ movieStats: movieStats });
      } catch (error) {
        console.error("Error getting movie stats:", error);
        res.status(500).json({ message: "Internal server error" });
      }
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