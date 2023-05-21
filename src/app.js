const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const mongoose = require('mongoose');

const app = express();

app.use(morgan('dev'));
app.use(helmet());

// access to the application ( dashboard , app mobile )
app.use(cors());

// middleware update ( body / header ) http request / response => check if the payload is JSON
app.use(express.json());

// memoire f serveur de taille sghir --> token -> authebtification
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// ORM -> first connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error(err);
});

app.get('/', (req, res) => {
  res.json({
    message: '👋🌎',
  });
});


// logique metier
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
