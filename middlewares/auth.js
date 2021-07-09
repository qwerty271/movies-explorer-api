const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { config } = require('../config');

module.exports = (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (!cookie) {
    throw new UnauthorizedError('Необходима авторизация1');
  }

  let payload;

  try {
    payload = jwt.verify(
      cookie,
      // 'secret'
      config.JWT_SECRET
    );
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
