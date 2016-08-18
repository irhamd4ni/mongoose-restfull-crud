'use strict';

const express = require('express');
const router = express.Router();
const Model = require('../models/organization');

const options = {
  populate: 'organization'
};

const crud = require('../../../src')(Model, options);

router.get('/', crud.get);
router.get('/:id', crud.getOne);
router.post('/', crud.post);
router.put('/:id', crud.put);
router.delete('/:id', crud.delete);

module.exports = router;
