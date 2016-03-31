const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
const router = require('./router');

// Express configuration
// Use morgan as our logging lib
app.use(morgan('combined'));
// Parse everything as json, no matter the request type
app.use(bodyParser.json({ type: '*/*' }));
// inject routes into app
router(app);

const start = (options) => {
  const { port, env } = options;
  app.locals.env = env;

  mongoose.connect(config[env].dbUrl);

  const server = http.createServer(app);
  server.listen(port);

  console.log('Server['+ env + '] running at: ' + port);
};

exports.start = start;
