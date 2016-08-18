# Mongoose RESTful CRUD

**TODO: @jsdoc: [http://usejsdoc.org/](http://usejsdoc.org/)**

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

## CRUD options

**TODO: Explain how to use options.**

## Extending

**TODO: Explain how to extend.**

## Bulk Post

**TODO: Explain post using bulk.**

## JSON return

**TODO: Details, details.**

*    `GET /api/MODEL_NAME` (collection)

```javascript
{
  "_id": "57b51b95825a1d6354638c17",
  "name": "My boy",
  "__v": 0,
  "created": "2016-08-18T02:21:09.794Z"
}
```

*    `GET /api/MODEL_NAME/:id`

```javascript
{
  "page": 1,
  "pages": 1,
  "perPage": 20,
  "totalCount": 5,
  "results": [
    {
      "_id": "57b51b95825a1d6354638c17",
      "name": "My boy",
      "__v": 0,
      "created": "2016-08-18T02:21:09.794Z"
    },
    {
      "_id": "57b51c45f0d98dcf54603294",
      "name": "My boy",
      "__v": 0,
      "created": "2016-08-18T02:24:05.146Z"
    },
    {
      "_id": "57b51ca8528e550355c326c2",
      "name": "My boy",
      "__v": 0,
      "created": "2016-08-18T02:25:44.713Z"
    },
    {
      "_id": "57b51eb68dde44ad5680d531",
      "name": "My boy",
      "__v": 0,
      "created": "2016-08-18T02:34:30.090Z"
    },
    {
      "_id": "57b51f2145096eed56cbba42",
      "name": "My boy again",
      "__v": 0,
      "created": "2016-08-18T02:36:17.721Z"
    }
  ]
}
```

*    `POST /api/MODEL_NAME` or `PUT /api/MODEL_NAME/:id`

Returns the object created/updated (as `GET /api/MODEL_NAME/:id` or validation errors:

```javascript
{
  "errors": [
    {
      "name": "Organization name is required."
    }
  ]
}
```

*    `DELETE /api/MODEL_NAME/:id`

Returns a message:

```javascript
{
  "message": "Record removed"
}
```

OR

```javascript
{
  "errors": [
    "Record not found"
  ]
}
```

## Filtering, sorting, changing pagination

**TODO Explain.**


## Example

```bash
cd example
npm install
npm start
```

You have two models, `people` and `organization`. In this example you'll have
a [http://localhost:3000](http://localhost:3000) with the following endpoints:

*   GET /api/peoples
*   GET /api/peoples/:id
*   POST /api/peoples
*   PUT /api/peoples/:id
*   DELETE /api/peoples/:id

*   GET /api/organizations
*   GET /api/organizations/:id
*   POST /api/organizations
*   PUT /api/organizations/:id
*   DELETE /api/organizations/:id

You need to send requests using body and

CURL examples:

```bash
# Organization GET
curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: e12b3769-fb7a-eee5-9838-1fb0873fe322" "http://localhost:3000/api/organizations"

# Organization GET One
curl -X GET -H "Cache-Control: no-cache" -H "Postman-Token: 2d6df4da-1096-8314-0401-5912748c2ec0" "http://localhost:3000/api/organizations/57b51b95825a1d6354638c17"

# Organization POST
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 8063f2bd-001c-ef01-3c49-aa8f59d2ae8e" -d '{"name": "My Company"}' "http://localhost:3000/api/organizations"

# Organization PUT
curl -X PUT -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: f9878eb1-84f9-8844-9da5-5c7731daaac5" -d '{"name": "My Company has changed"}' "http://localhost:3000/api/organizations/57b624f63a1b29aa0f4e0821"

# Organization DELETE
curl -X DELETE -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 8c8add52-2c61-9a28-47ed-262163579623" -d '{}' "http://localhost:3000/api/organizations/57b51b95825a1d6354638c17"
```
