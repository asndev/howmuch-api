const passport = require('passport');
const User = require('../models/User');
const { secret } = require('../../config');
// Strategies
const { Strategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.checkPassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  // jwt subject contains our user id
  User.findOne(payload.sub, (err, user) => {
    if (err) { return done(err, false); }

    done(null, user ? user : false);
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
