require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose =require('mongoose')
const express = require('express')
const app = express()
const movieRoute = require('./routes/movieRoute')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const cookieParser = require("cookie-parser");

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())


//Routes Middleware
app.use('/api/movie',movieRoute)
app.use('/api/user',userRoute)
app.use('/api/products',productRoute)

//Error Middleware


//Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`)
      console.log('DB Connected Successfully');
    });
  })
  .catch((err) => console.log(err));