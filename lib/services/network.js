const request = require('superagent');

const subscribe = () => {
  return request
    .post('http://temp.alchemycodelab.io/subscribe')
    .send({
      url: process.env.URL
    });
};

module.exports = {
  subscribe
};
