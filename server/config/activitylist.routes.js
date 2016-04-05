const express = require('express');
const router = express.Router();

router
  .get('/', (req, res) => {
    res.send('get /');
  });

router
  .get('/:id', (req, res) => {
    res.send('get with id: ' + req.params.id);
  })
  .post('/:id', (req, res) => {
    res.send('post with id: ' + req.params.id);
  })
  .delete('/:id', (req, res) => {
    res.send(' delete with id: ' + req.params.id);
  });

module.exports = router;
