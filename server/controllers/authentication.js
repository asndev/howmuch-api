const jwt = require('jwt-simple');
const moment = require('moment');
const { secret } = require('../../config');

const User = require('../models/User');

const generateToken = (user) => {
  const timestamp = new Date().getTime();
  const expires = moment().add(1, 'days').valueOf();
  return jwt.encode({
    sub: user.id,
    iat: timestamp,
    exp: expires
  }, secret);
};

const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ success: false, error: '`email` and `password` are mandatory.' });
  }

  User.findOne({ email }, (err, existing) => {
    if (err) { return next(err); }
    if (existing) {
      return res.status(422)
        .send({ success: false,  error: '`email` already registered.' });
    }

    const user = new User({ email, password });

    user.save((err) => {
      if (err) { return next(err); }
      res.json({ token: generateToken(user) });
    });
  });
};

const signin = (req, res, next) => {
  if (!req.user) {
    res.status(422)
      .send({ success: false, error: 'No user available' });
  }
  // user was extracted via signin middleware
  res.send({ success: true, token: generateToken(req.user) });
};

exports.signin = signin;
exports.signup = signup;
