const { Router } = require('express');
const Temperature = require('../models/Temperature');

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

  .get('/hotest', (req, res, next) => {
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
  });
