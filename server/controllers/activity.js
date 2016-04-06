const Activity = require('../models/Activity');

const findAll = (req, res, next) => {
  Activity.find({
    _activityListId: req.params.listId
  }, (err, activities) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: activities
    });
  });
};

const findOne = (req, res, next) => {
  Activity.findOne(req.params.id, (err, activity) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: activity
    })
  });
};

const update = (req, res, next) => {
  Activity.findOneAndUpdate(req.params.id, {
    $set: { timestamp: req.body.timestamp}
  }, { new: true }, (err, updatedActivity) => {
    res.json({
      success: true,
      data: updatedActivity
    });
  });
};

const create = (req, res, next) => {
  console.log('Creating with list id: ', req.params);
  new Activity({
    _activityListId: req.params.listId
  }).save((err, newActivity) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: newActivity
    });
  });
};

const remove = (req, res, next) => {
  Activity.findOneAndRemove(req.params.listId, (err) => {
    if (err) { return next(err); }
    res.json({
      success: true
    });
  });
};

exports.findAll = findAll;
exports.findOne = findOne;
exports.create = create;
exports.remove = remove;
exports.update = update;
