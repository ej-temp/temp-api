require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const { subscribe } = require('../lib/services/network');
const Location = require('../lib/models/Location');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  // it('subscibes to the network', () => {
  //   return subscribe()
  //     .then(res => {
  //       console.log(res.body);
  //       expect(res.body).toEqual({
  //         _id: expect.any(String),
  //         url: 'https://ej-temp.herokuapp.com/',
  //         createdAt: expect.any(String),
  //         updatedAt: expect.any(String)
  //       });
  //     });
  // });

  it('gives its status', () => {
    return request(app)
      .get('/status')
      .then(res => {
        expect(res.status).toEqual(204);
      });
  });

  it('registers a location if does not exist', () => {
    return request(app)
      .post('/register')
      .send({ name: 'Mars' })
      .then(res => {
        expect(res.body).toEqual({ id: expect.any(String) });
      });
  });

  it('registers a location if does not exist', async() => {
    const venus = await Location.create({ name: 'Venus' });

    return request(app)
      .post('/register')
      .send({ name: 'Venus' })
      .then(res => {
        expect(res.body).toEqual({ id: venus._id.toString() });
      });
  });

  it('deletes a location upon deregistration', async() => {
    const jupiter = await Location.create({ name: 'Jupiter' });
    return request(app)
      .delete('/deregister')
      .send({ id: jupiter._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: jupiter._id.toString(),
          name: 'Jupiter',
          __v: 0
        });
      });
  });
});
