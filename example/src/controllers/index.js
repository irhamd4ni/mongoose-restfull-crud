'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../config/config');

router.use('/api/peoples', require('./peoples'));
router.use('/api/organizations', require('./organizations'));

module.exports = router;
