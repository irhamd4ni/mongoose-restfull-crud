'use strict';

const mongoose = require('mongoose');
const config = require('../config/config');
mongoose.Promise = require('bluebird');
const db = mongoose.connection;
mongoose.set('debug', true)


if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true)
}

const c = `mongodb://${config.mongo.host}/${config.mongo.name}`;

mongoose.connect(c, function(err) {
  if (err) {
    return console.error('Mongo connection error.', err);
  }
});

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('MongoDB conected via mongoose.');
});

exports.db = db;
