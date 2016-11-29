const express = require('express');
const ActivityListCtrl = require('../controllers/activitylist');
const router = express.Router(); // eslint-disable-line

router
  .get('/', ActivityListCtrl.findAll)
  .post('/', ActivityListCtrl.create);

router
  .get('/:id', ActivityListCtrl.findOne)
  .put('/:id', ActivityListCtrl.update)
  .delete('/:id', ActivityListCtrl.remove);

module.exports = router;
