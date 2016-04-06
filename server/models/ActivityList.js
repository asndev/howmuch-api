const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, min: 1 },
  _creator: { type: Schema.Types.ObjectId, ref: 'user'}
}, {
  strict: 'throw'
});

module.exports = mongoose.model('activitylist', schema);
