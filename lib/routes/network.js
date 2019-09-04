const { Router } = require('express');

module.exports = Router()
  .get('/status', (req, res, next) => {
    res.status(204);
    res.send();
  });
