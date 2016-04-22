const express = require('express');
const ActivityListCtrl = require('../controllers/activitylist');
const router = express.Router();

router
  .get('/', ActivityListCtrl.findAll)
  .get('/plain', ActivityListCtrl.findPlain)
  .post('/', ActivityListCtrl.create);

router
  .get('/:id', ActivityListCtrl.findOne)
  .put('/:id', ActivityListCtrl.update)
  .delete('/:id', ActivityListCtrl.remove);

module.exports = router;
