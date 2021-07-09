const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [
      {
        validator: (value) => isUrl(value),
        msg: 'Неправильная ссылка',
      },
    ],
  },
  trailer: {
    type: String,
    required: true,
    validate: [
      {
        validator: (value) => isUrl(value),
        msg: 'Неправильная ссылка',
      },
    ],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [
      {
        validator: (value) => isUrl(value),
        msg: 'Неправильная ссылка',
      },
    ],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
