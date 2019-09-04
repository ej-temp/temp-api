const { Router } = require('express');

module.exports = Router()
  // eslint-disable-next-line no-unused-vars
  .get('/status', (req, res, next) => {
    res.status(204);
    res.send();
  });
