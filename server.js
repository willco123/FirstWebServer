const express = require('express');
const app = express();

require('./startup/config');
require('./startup/db');
require('./startup/routes')(app)
//This module should handle all server initialisation


const port = process.env.PORT || 3001;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
