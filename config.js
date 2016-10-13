
const config = {
  secret: '1kun31gku1kg1knf',
  dev: {
    dbUrl: 'mongodb://localhost/howmuch'
  },
  test: {
    dbUrl: 'mongodb://localhost/howmuch-test'
  },
  prod: {
    dbUrl: process.env.DB_URL // Heroku Config Var
  }
};

module.exports = config;
