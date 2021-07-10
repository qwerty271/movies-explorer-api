const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { config } = require('../config');

module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const opts = { new: true, runValidators: true };
  return User.findByIdAndUpdate(req.user._id, { ...req.body }, opts)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log('Was error', err);
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при редактировании профиля',
        );
      } else if (err.name === 'CastError') {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => bcrypt
  .hash(req.body.password, 10)
  .then((hash) => User.create({
    name: req.body.name,
    email: req.body.email,
    password: hash,
  }))
  .then((user) => {
    if (user) {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    }
  })
  .catch((err) => {
    console.log('Was error', err);
    if (err.name === 'ValidationError') {
      throw new BadRequestError(
        'Переданы некорректные данные при создании профиля',
      );
    } else if (err.name === 'MongoError' && err.code === 11000) {
      throw new ConflictError('Данный электронный адрес уже зарегистрирован');
    }
  })
  .catch(next);

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError('Неправильные почта или пароль'),
        );
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new UnauthorizedError('Неправильные почта или пароль'),
            );
          }
          return user;
        })
        .then((us) => {
          const token = jwt.sign(
            {
              _id: us._id,
            },
            config.JWT_SECRET,
            // 'secret',
            { expiresIn: '7d' },
          );

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          });
          res.status(200).send({ token });
        });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  const user = req.user._id;
  return User.findById(user)
    .then(() => {
      res.clearCookie('jwt');
      res.status(200).send(user);
    })
    .catch(next);
};
