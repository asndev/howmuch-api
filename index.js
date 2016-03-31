const server = require('./server');

// Server
const port = process.env.PORT || 3030;
server.start({ env: 'dev', port });
