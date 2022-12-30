import express from 'express';
// @ts-ignore
import request from 'supertest';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore
import session from 'supertest-session';
// @ts-ignore
import { describe, expect, test, beforeAll } from '@jest/globals'

import router from '../../routes';
import sessionMiddleware from '../../middlewares/redis';

const app = express();
let headers: any = { Accept: 'application/json' };
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use('/', router);


const email = `${uuidv4()}@test.com`;
const password = '123456789'

let conversations = {
  id: String,
};

let message: any;
let user: any;
let authenticatedSession: any;
let createdConversation: any;
const testSession = session(app);

describe('Messages', () => {
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
      .end(async () => {
        const res = await testSession.post('/auth/signin')
          .send({
            email,
            password,
          })
        authenticatedSession = testSession;
        user = res.body;
        console.log(user);
        const rawCookie = res.header['set-cookie'];
        if (rawCookie[0] != null) {
          const index = rawCookie[0].indexOf(';');
          headers['cookie'] =
            (index == -1) ? rawCookie : rawCookie[0].substring(0, index);
        }
        return done();
      });
  })

  test('New message', async () => {
    console.log({
      Users: [
        user.id
      ]
    });
    const conv = await request(app)
      .post('/conversations')
      .set(headers)
      .send({
        Users: [
          user.id
        ]
      })
    console.log(conv)
    console.log(conv.body)
    const conversationId = conv.body.id;
    const res = await request(app)
      .post('/messages')
      .set(headers)
      .send({
        content: 'coucou',
        conversationId,
      })
    message = res.body;
    expect(res.statusCode).toBe(200);
  });

  test('Delete message', async () => {
    const res = await request(app)
      .delete(`/messages/${message.id}`)
      .set(headers)
    expect(res.statusCode).toBe(200);
  });
})
