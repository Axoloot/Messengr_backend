import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { collectDefaultMetrics, register } from 'prom-client';

import routes from './routes';
import logger from './logger';
import logMiddleware from './middlewares/log';
import { connectToDatabase } from './database';
import errorMiddleware from './middlewares/error';
import sessionMiddleware from './middlewares/redis';
import { notFoundMiddleware } from './middlewares/notFound';
import socketIo from './socketio';

const port = '8000';
const httpsPort = '8001';

app.use(express.bodyParser({limit: '50mb'}));
const app = express();

collectDefaultMetrics()

app.get('/metrics', async (_req: any, res: any) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});


app.set('trust proxy', true);

app.use(logMiddleware);
app.use(helmet());
app.use(bodyParser.json());

const whitelistedHosts = [
  'FLUTTER',
];

app.use(cors({
  origin: (origin, callback) => {
    if (whitelistedHosts.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // callback(new Error('Not allowed by CORS'))
      // SI PB DE CORS: COMMENTER AU DESSUS ET DECOMMENTER EN DESSOUS
      callback(null, true)
    }
  },
  methods: ['PATCH', 'POST', 'PUT', 'DELETE', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));

app.use(sessionMiddleware);

app.use(routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const httpsInit = () => {
  const privateKey = fs.readFileSync('./https/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('./https/fullchain.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  socketIo(httpsServer);

  httpsServer.listen(httpsPort, () => {
    logger.info(`server is listening on port ${httpsPort}`);
  });

}

const httpInit = () => {
  const httpServer = http.createServer(app);
  socketIo(httpServer);

  httpServer.listen(port, () => {
    logger.info(`server is listening on port ${port}`);
  });
}

connectToDatabase().then(() => {
  httpInit();
  // if (process.env.ENVIRONNEMENT !== 'DEV') httpsInit();
}).catch(() => {
  process.exit(1);
});

