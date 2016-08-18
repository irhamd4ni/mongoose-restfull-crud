'use strict';

const _ = require('lodash');

const errorFormat = function(err) {
  const obj = {errors: []};

  // It's just a string error
  if (_.isString(err)) {
    obj.errors.push(err);

  // Mongoose validation errors
  } else if (err.errors && err.name === 'ValidationError') {
    _.each(err.errors, function(e, i) {
      const msg = {};
      msg[i] = e.message;
      obj.errors.push(msg);
    });

  // Mongoose duplicate key erors
  } else if (err.code === 11000) {
    obj.errors.push('This record already exists in the system.');

  // Any other codes
  } else if (err.code) {
    obj.errors.push(err.errmsg);

  // A generic err.errors object or array
  } else if (_.isObject(err.errors) || _.isArray(err.errors)) {
    _.each(err.errors, function(e, k) {
      obj.errors.push(e.message);
    });

  // There is a err.message
  } else if (_.isString(err.message)) {
    obj.errors.push(err.message);

  } else {
    obj.errors.push('Unknown error.');
  }

  return obj;
}

module.exports = errorFormat;
