const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, lowercase: true, unique: true },
  password: String
});

schema.pre('save', function(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { next(err); }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { next(err); }

      user.password = hash;
      next();
    });
  })
});

schema.methods.checkPassword = function(passwd, callback) {
  bcrypt.compare(passwd, this.password, (err, isMatch) => {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
}

module.exports = mongoose.model('user', schema);
