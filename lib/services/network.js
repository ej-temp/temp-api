const request = require('superagent');

const subscribe = () => {
  return request
    .post('http://temp.alchemycodelab.io/subscribe')
    .send({
      url: process.env.URL
    })
    .then(res => res.body);
};

module.exports = {
  subscribe
};
