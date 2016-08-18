# Mongoose RESTful CRUD

Todo @jsdoc: [http://usejsdoc.org/]()


mongoose-restfull-crud is a simple express middleware to create a JSON API for
Mongoose models. As a middleware it can be nested with other middlewares
and it's very customizable (and extensible).

## install

```bash
npm install --save mongoose-restfull-crud
```

## Usage

3 Steps:

### 1. Create your Mongoose model

Something starting with:

```javascript
// Sample models/organization.js file

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: 'Organization name is required.'
  },
  created: {
    type: Date,
    default: Date.now
  }
});
const Model = mongoose.model('Organization', schema);

module.exports = Model;
```

### 2. Creat a controller using the follwing pattern

```javascript
// Sample controller/organization.js file
'use strict';

const express = require('express');
const router = express.Router();
const Model = require('../models/organization');

const options = {
  // select: {}
  // filter: {}
  // sort: { _id: 'asc' }
  // page: 1
  // perPage: 20
  // population: null
};

const crud = require('../../../src')(Model, options);

router.get('/', crud.get);
router.get('/:id', crud.getOne);
router.post('/', crud.post);
router.put('/:id', crud.put);
router.delete('/:id', crud.delete);

module.exports = router;
```

### 3. Add the routes to your express app

Don't forget to add [body-parser](https://github.com/expressjs/body-parser)
to get JSON response.

```javascript
// Sample ./app.js file
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

require('./mongoose');

app.use(bodyParser.json());
app.use(require('./controllers'));

module.exports = app;
```

Then start the server as you like.

## Example

```bash
cd example
npm install
npm start
```
