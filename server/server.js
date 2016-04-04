const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const responseTime = require('response-time');
const cors = require('cors');

const router = require('./router');
const config = require('../config');

const app = express();
app.use(responseTime());
app.disable('x-powered-by');
// Parse everything as json, no matter the request type
app.use(bodyParser.json({ type: '*/*' }));
// cors
app.use(cors());
app.options('*', cors());
// inject routes into app
router(app);

const start = (options) => {
  const { port, env } = options;
  app.locals.env = env;

  // Use morgan as our logging lib
  if (env !== 'test') {
    app.use(morgan('combined'));
  }

  mongoose.connect(config[env].dbUrl);

  const server = http.createServer(app);
  server.listen(port);

  console.log('Server['+ env + '] running at: ' + port);
};

exports.start = start;
exports.app = app;
