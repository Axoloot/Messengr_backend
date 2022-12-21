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

let association = {
  id: String,
};

let authenticatedSession: any;
const testSession = session(app);

describe('Associations', () => {
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

  test('Get all Associations', async () => {
    const res = await request(app)
      .get('/associations')
    association = res.body[0];
    expect(res.statusCode).toBe(200);
  });

  test('Get an Association', async () => {
    const res = await request(app)
      .get(`/associations/${association.id}`)
    expect(res.statusCode).toBe(200);
  });

  test('Get an Association Pot', async () => {
    const res = await request(app)
      .get(`/pots/associations/${association.id}`)
    expect(res.statusCode).toBe(200);
  });

  test('Create an Association as Partner', async () => {
    const res = await authenticatedSession
      .post('/associations')
      .send({
        'email': `${uuidv4()}@project.com`,
        'name': 'test association',
        'description': 'test description',
        'title': 'test title',
        'longitutde': 100,
        'latitude': 100,
        'image': 'data:image/png;base64,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'
      })
    expect(res.statusCode).toBe(200);
  });

  test('Create an Association Pot', async () => {
    const res = await request(app)
      .post(`/pots/associations/${association.id}`)
      .send({
        amount: 1000,
        name: `${uuidv4()}pot`,
        description: 'project pot',
      })
    expect(res.statusCode).toBe(200);
  });
})
