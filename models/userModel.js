const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      ,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be up to 6 characters"]
  },
  coins: {
    type: Number,
    default: 0,
  },
  votes: {
    type: Number,
    default: 0,
  },
  userRole: {
    type: String,
    enum: ['admin', 'user', 'cinemaowner'],
    default: 'user',
  },
  ratingUser: {
    type: String,
    enum: ['regular', 'bronze', 'silver', 'gold'],
    default: 'regular',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
