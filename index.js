const server = require('./server/server');

// Server
const port = process.env.PORT || 3030;
const env = process.env.NODE_ENV || 'dev';
server.start({ env, port });
