const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const index = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const CORS_WHITELIST = [
  'http://localhost:3000',
  'https://movies-explorer.qwerty271.nomoredomains.monster',
  'http://movies-explorer.qwerty271.nomoredomains.monster',
];
const corsOption = {
  credentials: true,
  origin: function checkCorsList(origin, callback) {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(requestLogger);
app.use(cors(corsOption));
app.use(index);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    })
    .catch(next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
