const { Router } = require('express');
const Location = require('../models/Location');
const Temperature = require('../models/Temperature');

module.exports = Router()
  // eslint-disable-next-line no-unused-vars
  .get('status', (req, res, next) => {
    res.status(204);
    res.send();
  })

  .post('register', (req, res, next) => {
    const { name } = req.body;
    Location
      .findOneAndUpdate({ name }, { expire: new Date() }, { upsert: true, new: true })
      .then(location => {
        res.send({ id: location._id });
      })
      .catch(next);
  })

  .delete('deregister', (req, res, next) => {
    const { id } = req.body;
    Location
      .findByIdAndDelete(id)
      .then(location => res.send(location))
      .catch(next);
  })

  .post('temp/:id', (req, res, next) => {
    const { temperature } = req.body;
    Temperature
      .create({ locationId: req.params.id, temp: temperature })
      .then(temp => res.send(temp))
      .catch(next);
  });
