import express from 'express';
// @ts-ignore
import request from 'supertest';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import session from 'supertest-session';
import { describe, expect, test, beforeAll } from '@jest/globals'


import router from '../../routes';
import sessionMiddleware from '../../middlewares/redis';

const app = express();
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/', router);

const email = `${uuidv4()}@test.com`;
const password = '123456789'

let authenticatedSession: any;
const testSession = session(app);

describe('Users', () => {
  beforeAll((done) => {
    request(app)
      .post('/auth/signup')
      .send({
        email,
        password,
        firstname: 'john',
        lastname: 'doe',
        type: 'User',
      })
      .end(() => {
        testSession.post('/auth/signin')
          .send({
            email,
            password,
          })
          .end(() => {
            authenticatedSession = testSession;
            return done();
          })
      });
  })

  test('Get Me', async () => {
    const res = await authenticatedSession
      .get('/users/me')
    expect(res.statusCode).toBe(200);
  });

  test('Who', async () => {
    const res = await authenticatedSession
      .get(`/users/${authenticatedSession.id}`)
    expect(res.statusCode).toBe(200);
  });

  test('All users', async () => {
    const res = await authenticatedSession
      .get('/users/');
    expect(res.statusCode).toBe(200);
  });
})
