const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      console.log('Was error', err);
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании фильма'
        );
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return Movie.findById(movieId)
    .then((movie) => {
      if (movie.owner === null) {
        throw new NotFoundError('Фильм удален').catch(next);
      } else if (movie.owner.equals(req.user._id)) {
        return Movie.findByIdAndRemove(movieId).then((movie) =>
          res.status(200).send(movie)
        );
      } else {
        throw new ForbiddenError('Чужой фильм').catch(next);
      }
    })

    .catch((err) => {
      console.log('Was error', err);
      if (err.name === 'CastError') {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } else if (err.name === 'TypeError') {
        throw new NotFoundError('Фильм удален');
      } else {
        throw new ForbiddenError('Чужой фильм');
      }
    })
    .catch(next);
};
