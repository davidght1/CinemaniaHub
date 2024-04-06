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
const protectAdmin = require('../middleWare/authAdminMiddleware')
const protectCinemaOwner = require('../middleWare/authCinemaOwnerMiddleware')


const upload = require('../utils/multerConfig');


// ---- for cinema owners only!!! ----

//get movie details (for cinema owners)
router.get('/details',protectCinemaOwner, getMovieStats)


// ---- for all ----
//get all movies
router.get("/",getAllMovies);

//get single movie
router.get("/getOne/:_id",getSingleMovie)

// ---- for users only!!! ----

//update user rating about single movie
router.patch("/rate/:id",protectUser, updateRatingMovie)

//update user vote about single movie (only if he rate the movie!!!)
router.patch("/vote/:id",protectUser, updateVoteMovie)

//update user commends about single movie
router.patch("/commends/:id",protectUser, updateCommendsMovie)


// ---- for admin only!!! ---- 

//add movie (only by admin)
router.post("/",protectAdmin, upload.single("photo"), createMovie)

//edit movie (only by admin)
router.patch('/update/:id',protectAdmin, updateMovie)

//delete movie(only by admin)
router.delete('/delete/:id',protectAdmin, deleteMovie)



module.exports = router