import redisConnector from 'connect-redis';
import expressSession from 'express-session';
import redisClient from '../redis';

const Connector = redisConnector(expressSession);

const sessionMiddleware = expressSession({
  secret: '12345678',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
  },
  store: new Connector({ client: redisClient }),
});

export default sessionMiddleware;
