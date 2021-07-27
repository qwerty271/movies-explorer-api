const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser,
);
router.use('/', auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', logout);
router.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
