require('dotenv').config();

module.exports.config = {
  JWT_SECRET:
    process.env.NODE_ENV === 'production'
      ? process.env.JWT_SECRET
      : 'dev-secret',
};
