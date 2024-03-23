const express = require('express')
const protectUser = require('../middleWare/authUserMiddleware')
const protectAdmin = require('../middleWare/authAdminMiddleware')
const router = express.Router()
const  {createProduct,buyProduct,getAllProducts} = require('../controllers/productController')

const upload = require('../utils/multerConfig');

// --- admin only ---

//create product
router.post('/create',protectAdmin ,upload.single("photo") ,createProduct)

// --- users only ---

// buy product
router.get('/buy/:id',protectUser ,buyProduct)

// get all product
router.get('/',protectUser ,getAllProducts)


module.exports = router

