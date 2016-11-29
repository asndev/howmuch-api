const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, lowercase: true, unique: true },
  password: { type: String, min: 5 }
}, {
  strict: 'throw'
});

schema.pre('save', function(next) {
  const user = this; // eslint-disable-line

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { next(err); }
    // hash the password with the generated salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { next(err); }
      // replace the plain password with the hash
      user.password = hash;
      next();
    });
  });
});

schema.methods.checkPassword = function(givenPassword, callback) {
  // compare the given password with the hashed password
  bcrypt.compare(givenPassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('user', schema);
