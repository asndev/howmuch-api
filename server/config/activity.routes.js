const express = require('express');
const ActivityCtrl = require('../controllers/activity');
const router = express.Router(); // eslint-disable-line

router
  .get('/:listId/activity', ActivityCtrl.findAll)
  .get('/:listId/activty/plain', ActivityCtrl.findPlain)
  .post('/:listId/activity', ActivityCtrl.create);

router
  .get('/:listId/activity/:id', ActivityCtrl.findOne)
  .put('/:listId/activity/:id', ActivityCtrl.update)
  .delete('/:listId/activity/:id', ActivityCtrl.remove);

module.exports = router;
