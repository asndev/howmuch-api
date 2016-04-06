const express = require('express');
const ActivityCtrl = require('../controllers/activity');
const router = express.Router();

router
  .get('/:listId/activity', ActivityCtrl.findAll)
  .post('/:listId/activity', ActivityCtrl.create);

router
  .get('/:listId/activity/:id', ActivityCtrl.findOne)
  .put('/:listId/activity/:id', ActivityCtrl.update)
  .delete('/:listId/activity/:id', ActivityCtrl.remove);

module.exports = router;