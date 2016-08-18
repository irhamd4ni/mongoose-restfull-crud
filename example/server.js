'use strict';

const config = require('./config/config');
const app = require('./src/app');

const port = config.server.port || 3000;
const host = config.server.host || 'localhost';
const server = require('http').createServer(app);
server.listen(port, host, () => {
    console.log(`${config.server.banner} - running on port ${host}:${port}.` || `Mongoose CRUD for RESTful Server - running on port ${host}:${port}.`);
});
