'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./mongoose');

app.use(bodyParser.json());
app.use(require('./controllers'));

module.exports = app;
