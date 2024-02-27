const express = require('express');
const router = express.Router()
const { getAllMovies,
        getSingleMovie,
        updateMovie,
        updateRatingMovie,
        updateVoteMovie,
        getMovieStats,
        createMovie,
        deleteMovie} = require('../controllers/movieController')

// ---- for all ----
//get all movies
router.get("/",getAllMovies);

//get single movie
router.get("/:id",getSingleMovie)

// ---- for users ----

//update user vote about single movie
router.patch("/vote/:id",updateVoteMovie)

//update user rating about single movie
router.patch("/rate/:id",updateRatingMovie)



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