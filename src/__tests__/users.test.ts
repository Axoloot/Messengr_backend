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

let project = {
  id: String,
};
let association = {
  id: String,
};
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

  test('Get Me', async () => {
    const res = await authenticatedSession
      .get('/users/me')
    expect(res.statusCode).toBe(200);
  });

  test('Modify Me', async () => {
    const res = await authenticatedSession
      .patch('/users/me')
      .send({
        firstname: 'Test'
      })
    expect(res.statusCode).toBe(200);
  });

  test('Follow a Project', async () => {
    const projects = await request(app)
      .get('/projects')
    project = projects.body[0];
    const res = await authenticatedSession
      .post(`/users/me/follow-project/${project.id}`);
    expect(res.statusCode).toBe(200);
  });

  test('Get following Projects (expect 1)', async () => {
    const res = await authenticatedSession
      .get('/users/me');
    expect(res.body.FollowedProjects.length).toBe(1);
    expect(res.statusCode).toBe(200);
  });

  test('Unfollow a Project', async () => {
    const res = await authenticatedSession
      .delete(`/users/me/unfollow-project/${project.id}`);
    expect(res.statusCode).toBe(200);
  });

  test('Get following Projects (expect 0)', async () => {
    const res = await authenticatedSession
      .get('/users/me');
    expect(res.body.FollowedProjects.length).toBe(0);
    expect(res.statusCode).toBe(200);
  });

  test('Follow an Association', async () => {
    const associations = await request(app)
      .get('/associations')
    association = associations.body[0];
    const res = await authenticatedSession
      .post(`/users/me/follow-association/${association.id}`);
    expect(res.statusCode).toBe(200);
  });

  test('Get following Associations (expect 1)', async () => {
    const res = await authenticatedSession
      .get('/users/me');
    expect(res.body.FollowedAssociation.length).toBe(1);
    expect(res.statusCode).toBe(200);
  });

  test('Unfollow an Association', async () => {
    const res = await authenticatedSession
      .delete(`/users/me/unfollow-association/${association.id}`);
    expect(res.statusCode).toBe(200);
  });

  test('Get following Associations (expect 0)', async () => {
    const res = await authenticatedSession
      .get('/users/me');
    expect(res.body.FollowedAssociation.length).toBe(0);
    expect(res.statusCode).toBe(200);
  });

  test('Get Transactions', async () => {
    const res = await authenticatedSession
      .get('/users/me/transactions')
    expect(res.statusCode).toBe(200);
  });

  test('Get Piggy Bank', async () => {
    const res = await authenticatedSession
      .get('/users/me/piggybank')
    expect(res.statusCode).toBe(200);
  });
})
