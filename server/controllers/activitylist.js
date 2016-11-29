const ActivityList = require('../models/ActivityList');

const create = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(422)
      .send({ success: false, error: '`name` is mandatory.' });
  }

  new ActivityList({
    name: name,
    _creator: req.user._id
  }).save((err, newList) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: newList
    });
  });
};

const findAll = (req, res, next) => {
  ActivityList.find({}, (err, activityLists) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: activityLists
    });
  });
};

const findOne = (req, res, next) => {
  ActivityList.findOne({ _id: req.params.id }, (err, activityList) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: activityList
    });
  });
};

const update = (req, res, next) => {
  ActivityList.findOneAndUpdate({ _id: req.params.id
  }, req.body, { new: true }, (err, updatedList) => {
    if (err) { return next(err); }
    res.json({
      success: true,
      data: updatedList
    });
  });
};

const remove = (req, res, next) => {
  ActivityList.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) { return next(err); }
    res.json({
      success: true
    });
  });
};

exports.create = create;
exports.findAll = findAll;
exports.findOne = findOne;
exports.update = update;
exports.remove = remove;
