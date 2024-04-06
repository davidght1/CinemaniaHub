const express = require('express')
const router = express.Router()
const {registerUser,
        loginUser,
        logoutUser,
        getUserById
    } = require('../controllers/userController')


//Register user Route
router.post("/register",registerUser)
//login user route
router.post("/login",loginUser)
//logout user route 
router.get('/logout',logoutUser)
//get user details
router.get('/getUserDetails/:userId' , getUserById)


module.exports = router