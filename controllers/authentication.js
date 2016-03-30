const jwt = require('jwt-simple');
const config = require('../config');

const User = require('../models/User');

const generateToken = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: '`email` and `password` are mandatory.' });
  }

  User.findOne({ email }, (err, existing) => {
    if (err) { return next(err); }
    if (existing) {
      return res.status(422).send({ error: '`email` already registered.' });
    }

    const user = new User({
      email,
      password
    });

    user.save((err) => {
      if (err) { return next(err); }
      res.json({ token: generateToken(user) });
    });
  });
};

const signin = (req, res, next) => {
  res.send({ token: generateToken(req.user) });
};

exports.signin = signin;
exports.signup = signup;
