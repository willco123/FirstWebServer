const express = require('express');
const app = express();
//const logger = require('winston');


require('./startup/logging');
require('./startup/db');
require('./startup/routes')(app);


module.exports = app
