require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const { subscribe } = require('../lib/services/network');
const Location = require('../lib/models/Location');
const Temperature = require('../lib/models/Temperature');

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

  it('subscibes to the network', () => {
    return subscribe()
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          url: 'https://ej-temp.herokuapp.com/',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });
      });
  });

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
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });

  it('Adds a temperature', async() => {
    const cities = await Location.create([
      { name: 'Portland' },
      { name: 'Cleveland' },
      { name: 'Dayton' },
      { name: 'Seattle' },
    ]);

    await Temperature.create([
      { locationId: cities[1]._id, temp: 80 },
      { locationId: cities[2]._id, temp: 70 },
      { locationId: cities[1]._id, temp: 50 },
      { locationId: cities[3]._id, temp: 60 },
      { locationId: cities[1]._id, temp: 83 },
      { locationId: cities[3]._id, temp: 10 },
      { locationId: cities[1]._id, temp: 20 },
      { locationId: cities[2]._id, temp: 60 },
      { locationId: cities[1]._id, temp: 54 },
    ]);

    return request(app)
      .post(`/temp/${cities[0]._id}`)
      .send({ temperature: 87.5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          locationId: cities[0]._id.toString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          temp: 87.5,
          __v: 0
        });
      });
  });

  it('returns the list of locations with their most recent temp', async() => {
    const cities = await Location.create([
      { name: 'Portland' },
      { name: 'Cleveland' },
      { name: 'Dayton' },
      { name: 'Seattle' },
    ]);

    await Temperature.create([
      { locationId: cities[1]._id, temp: 80 },
      { locationId: cities[2]._id, temp: 70 },
      { locationId: cities[1]._id, temp: 50 },
      { locationId: cities[3]._id, temp: 60 },
      { locationId: cities[0]._id, temp: 83 },
      { locationId: cities[3]._id, temp: 10 },
      { locationId: cities[1]._id, temp: 20 },
      { locationId: cities[2]._id, temp: 60 },
      { locationId: cities[1]._id, temp: 54 },
    ]);

    return request(app)
      .get('/api/v1/temperatures')
      .then(res => {
        expect(res.body).toHaveLength(4);
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          temp: expect.any(Number),
          name: expect.any(String),
          createdAt: expect.any(String)
        });
      });
  });
});
