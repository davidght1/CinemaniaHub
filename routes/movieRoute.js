const express = require('express');
const router = express.Router()
const { getAllMovies,
        getSingleMovie,
        updateMovie,
        updateRatingMovie,
        updateVoteMovie,
        getMovieStats,
        createMovie,
        updateCommendsMovie,
        deleteMovie} = require('../controllers/movieController');
const protectUser = require('../middleWare/authUserMiddleware');

// ---- for all ----
//get all movies
router.get("/",getAllMovies);

//get single movie
router.get("/:id",getSingleMovie)

// ---- for users only!!! ----

//update user rating about single movie
router.patch("/rate/:id",protectUser,updateRatingMovie)

//update user vote about single movie (only if he rate the movie!!!)
router.patch("/vote/:id",protectUser,updateVoteMovie)

//update user commends about single movie
router.patch("/commends/:id",protectUser,updateCommendsMovie)


// ---- for admin only!!! ---- 

//add movie (only by admin)
router.post("/",createMovie)

//edit movie (only by admin)
router.patch('/update/:id',updateMovie)

//delete movie(only by admin)
router.delete('/delete/:id',deleteMovie)

// ---- for cinema owners only!!! ----

//get movie details (for cinema owners)
router.get('/details', getMovieStats)

module.exports = router