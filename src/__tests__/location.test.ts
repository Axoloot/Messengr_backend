import express from 'express';
// @ts-ignore
import request from 'supertest';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import session from 'supertest-session';
// @ts-ignore
import { describe, expect, test, beforeAll, beforeEach } from '@jest/globals'

import router from '../routes';
import sessionMiddleware from '../middlewares/redis';

const app = express();
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/', router);

const email = `${uuidv4()}@test.com`;
const password = '123456789'

let authenticatedSession: any;
const testSession = session(app);

describe('Location', () => {
  beforeAll((done) => {
    request(app)
      .post('/auth/signup')
      .send({
        email,
        password,
        firstname: 'john',
        lastname: 'doe',
        type: 'Partner',
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

  test('Verify a valid Location', async () => {
    const res = await request(app)
      .get('/location?latitude=48.9562018&longitude=2.8884657')
    expect(res.statusCode).toBe(200);
  });

  test('Verify an invalid Location (longitude)', async () => {
    const res = await request(app)
      .get('/location?latitude=48.9562018&longitude=-10100101100')
    expect(res.statusCode).toBe(400);
  });

  test('Verify an invalid Location (latitude)', async () => {
    const res = await request(app)
      .get('/location?latitude=-1002002020&longitude=2.8884657')
    expect(res.statusCode).toBe(400);
  });
})
