require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

/**
 * Database Setup
 */
mongoose.set('useUnifiedTopology', true); // disable warning of monitoring all the servers
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(console.log('mongoDb connected'))
  .catch(err => {
    throw new console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.use(require('./routes'));

app.listen(process.env.APP_PORT, () => {
  console.log('Server Online');
});
