const express = require('express');
const app = express();
//const logger = require('winston');





require('./startup/logging');
require('./startup/db');
require('./startup/routes')(app);
//This module should handle all server initialisation

module.exports = app
