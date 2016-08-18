'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    required: 'Required',
    unique: true,
    validate: {
      validator: function(v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: 'Invalid email'
    }
  },
  name: {
    type: String,
    required: 'Required'
  },
  birthday: {
    type: Date
  },
  addressStreet: {
    type: String
  },
  addressZipCode: {
    type: String
  },
  addressZipCity: {
    type: String
  },
  addressZipState: {
    type: String
  },
  addressCountry: {
    type: String
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: 'Required'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Model = mongoose.model('People', schema);

module.exports = Model;
