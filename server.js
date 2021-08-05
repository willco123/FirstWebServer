const express = require('express');
const app = express();
const logger = require('winston');

require('./startup/config');
require('./startup/logging');
require('./startup/db');
require('./startup/routes')(app)
//This module should handle all server initialisation



logger.log({
  level: 'info',
  message: 'Hello distributed log files!'
});




const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));


