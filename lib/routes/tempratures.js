const { Router } = require('express');
const Temperature = require('../models/Temperature');
const Location = require('../models/Location');

module.exports = Router()
  .get('/', (req, res, next) => {
    Temperature
      .getMostRecentTemps()
      .then(temps => res.send(temps))
      .catch(next);
  })

  .get('/coldest', (req, res, next) => {
    Temperature
      .getCurrentLow()
      .then(low => res.send(low[0]))
      .catch(next);
  })

  .get('/hottest', (req, res, next) => {
    Temperature
      .getCurrentHigh()
      .then(low => res.send(low[0]))
      .catch(next);
  })

  .get('/average', (req, res, next) => {
    Temperature
      .getMostRecentTemps()
      .then(temps => {
        let sum = 0;
        temps.forEach(temp => sum += temp.temp);
        let avg = sum / temps.length;
        res.send({ avgTemp: avg });
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    let temperatures = [];
    Temperature
      .find({ locationId: req.params.id })
      .sort({ createdAt: 1 })
      .limit(10)
      .then(temps => {
        temperatures = temps;
        return Location.findById(req.params.id);
      })
      .then(location => {
        res.send({ location, temps: temperatures });
      })
      .catch(next);
  });
