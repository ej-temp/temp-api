const { Router } = require('express');
const Location = require('../models/Location');

module.exports = Router()
  // eslint-disable-next-line no-unused-vars
  .get('/status', (req, res, next) => {
    res.status(204);
    res.send();
  })

  .post('/register', (req, res, next) => {
    const { name } = req.body;
    Location
      .findOneAndUpdate({ name }, { expire: new Date() }, { upsert: true, new: true })
      .then(location => {
        res.send({ id: location._id });
      })
      .catch(next);
  });
