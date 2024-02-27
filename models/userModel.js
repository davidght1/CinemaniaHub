const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
    enum: ['admin', 'user', 'cinemaOwner'],
    default: 'user',
  },
  ratingUser: {
    type: String,
    enum: ['regular', 'bronze', 'silver', 'gold'],
    default: 'regular',
  },
});

const RatingUser = mongoose.model('RatingUser', userSchema);

module.exports = RatingUser;
