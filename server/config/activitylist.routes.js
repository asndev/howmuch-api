const express = require('express');
const ActivityListCtrl = require('../controllers/activitylist.js');
const router = express.Router();

router
  .get('/', ActivityListCtrl.findAll)
  .post('/', ActivityListCtrl.create);

router
  .get('/:id', ActivityListCtrl.findOne)
  .put('/:id', ActivityListCtrl.update)
  .delete('/:id', ActivityListCtrl.remove);

module.exports = router;
