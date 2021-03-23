/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* global expect: true, describe: true, test: true, beforeAll: true, afterAll: true */
const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../config/express')();
const ResponseValidator = require('../response-validator');
const logger = require('../../config/logger');

const Admin = mongoose.model('Admin');
const AdminLog = mongoose.model('AdminLog');
const ErrorLog = mongoose.model('ErrorLog');

describe('Catalog - Admin Authentication API', () => {
  const agent = request.agent(app);

  let token;

  beforeAll((done) => {
    Admin.create([{
      username: 'testadmin',
      name: 'Test Admin',
      phoneNumber: '0000000000',
      password: 'testpass',
    }])
      .then(() => {
        done();
      })
      .catch(logger.trace);
  });

  test('should get error for missing username', (done) => {
    agent
      .post('/api/auth/admin')
      .send({})
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('"username" is required');
        done();
      });
  });

  test('should get error for invalid username type', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 12,
      })
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('"username" must be a string');
        done();
      });
  });

  test('should get error for missing password', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 'testadmin',
      })
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('"password" is required');
        done();
      });
  });

  test('should get error for invalid password type', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 'testadmin',
        password: 123,
      })
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('"password" must be a string');
        done();
      });
  });

  test('should get error for unknown username in admin login request', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 'test',
        password: 'test',
      })
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('Username/password is invalid');
        done();
      });
  });

  test('should get error for invalid password in admin login request', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 'testadmin',
        password: 'test',
      })
      .then((res) => ResponseValidator.checkApiServerError(res, expect))
      .then((res) => {
        expect(res.body.message).toBe('Username/password is incorrect');
        done();
      });
  });

  test('should be able to complete valid admin login request', (done) => {
    agent
      .post('/api/auth/admin')
      .send({
        username: 'testadmin',
        password: 'testpass',
      })
      .then((res) => ResponseValidator.checkApiSuccess(res, expect))
      .then((res) => {
        expect(typeof res.body.data).toBe('string');
        token = res.body.data;
        done();
      });
  });

  test('should get unauthorised access for retrieve admin profile request', (done) => {
    agent
      .get('/api/auth/admin')
      .then((res) => ResponseValidator.checkApiAuthError(res, expect))
      .then(() => {
        done();
      });
  });

  test('should be able to complete valid retrieve admin profile request', (done) => {
    agent
      .get('/api/auth/admin')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => ResponseValidator.checkApiSuccess(res, expect))
      .then((res) => {
        expect(res.body.data).toHaveProperty('username');
        expect(res.body.data.username).toBe('testadmin');
        expect(res.body.data).toHaveProperty('name');
        expect(res.body.data.name).toBe('Test Admin');
        expect(res.body.data).toHaveProperty('phoneNumber');
        expect(res.body.data.phoneNumber).toBe('0000000000');
        expect(res.body.data).toHaveProperty('accessType');
        expect(res.body.data.accessType).toBe('Admin');
        done();
      });
  });

  afterAll((done) => {
    Admin.deleteMany(({}))
      .then(() => AdminLog.deleteMany({}))
      .then(() => ErrorLog.deleteMany({}))
      .then(() => mongoose.disconnect())
      .then(() => {
        done();
      })
      .catch(logger.trace);
  });
});
