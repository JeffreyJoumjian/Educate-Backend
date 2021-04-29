const express = require('express');
const winston = require('winston');

const app = express();


require('./startup/config')();
require('./startup/logging')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/production')(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => winston.info(`Server started on port ${port}...`));

module.exports = server;