require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { subscribe } = require('../lib/services/network');

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
});
