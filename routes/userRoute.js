const express = require('express')
const router = express.Router()
const {registerUser,
        loginUser,
        logoutUser,
        loginStatus
    } = require('../controllers/userController')


//Register user Route
router.post("/register",registerUser)
//login user route
router.post("/login",loginUser)
//logout user route 
router.get('/logout',logoutUser)
// loginStatus user
router.get('/loginStatus',loginStatus)


module.exports = router