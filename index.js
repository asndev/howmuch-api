const config = require('./config');
const mongoose = require('mongoose');
const server = require('./server');

mongoose.connect(config.dbUrl);

// Server
const port = process.env.PORT || 3030;
server.start(port);
