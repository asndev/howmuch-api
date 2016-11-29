const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  timestamp: { type: Date, default: Date.now },
  _activityListId: { type: Schema.Types.ObjectId, ref: 'activitylist'}
}, {
  strict: 'throw'
});

module.exports = mongoose.model('activity', schema);
