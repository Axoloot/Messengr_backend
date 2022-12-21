import express from 'express';
// @ts-ignore
import request from 'supertest';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import { describe, expect, test } from '@jest/globals'

import router from '../routes';
import sessionMiddleware from '../middlewares/redis';

const app = express();
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/', router);

const email = `${uuidv4()}@test.com`;
const password = '123456789'

describe('Auth', () => {
  test('Sign Up', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        email,
        password,
        firstname: 'john',
        lastname: 'doe',
      });
    expect(res.statusCode).toBe(200);
  });

  test('Sign In', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({
        email,
        password,
      })
    expect(res.statusCode).toBe(200);
  });

  test('Sign Out', async () => {
    const res = await request(app)
      .delete('/auth/signout')
    expect(res.statusCode).toBe(204);
  });
})
