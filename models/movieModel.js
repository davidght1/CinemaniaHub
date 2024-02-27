const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  pictureUrl: {
    type: String,
    required: true,
  },

  // User choices for the movie
  userVotes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    choices: {
      type: [Number],
      validate: {
        validator: (choices) => choices.length === 3 && choices.every(choice => choice >= 1 && choice <= 8),
        message: 'You must select exactly 3 choices from the predefined options (1 to 8).',
      },
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Ratings from users
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // User posts about the movie
  userPosts: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;