import winston from 'winston';
import LokiTransport from 'winston-loki'

const logger = winston.createLogger({
  level: 'debug',
  transports: [new LokiTransport({
    host: 'http://loki:3100',
    labels: { app: 'fundy-beta-back' },
    json: true,
    format: winston.format.json(),
    replaceTimestamp: true,
    onConnectionError: (err) => console.error(err)
  }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info: any) => `${info.timestamp} [${info.level}]: ${info.message}`),
    ),
  }),
  ],
});

export default logger;
