
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');
const config = require('./config');

const mongoose = require('mongoose');

// Express Configuration

mongoose.connect(config.dbUrl);
// Use morgan as our logging lib
app.use(morgan('combined'));
// Parse everything as json, no matter the request type
app.use(bodyParser.json({ type: '*/*' }));

router(app);

// Server
const port = process.env.PORT || 3030;
const server = http.createServer(app);
server.listen(port);
console.log('Server running at: ' + port);
