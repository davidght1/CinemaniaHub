const express = require('express');
const router = express.Router()
const { getAllMovies,
    getSingleMovie,
    updateMovie,
    updateRatingMovie,
    updateVoteMovie,
    deleteMovie} = require('../controllers/movieController')
//get all movies

//get single movie

//update user vote about single movie

//update user rating about single movie


//add movie (only by admin)

//edit movie (only by admin)

//delete movie(only by admin)


module.exports = router