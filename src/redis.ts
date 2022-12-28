import redis from 'redis';
import logger from './logger';

logger.info('connecting to redis ...');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6380,
  password: '12345678',
});

client.on('error', (err: Error) => {
  logger.error(`redis client error: ${err.message}`);
  process.exit(1);
});

client.on('ready', () => logger.info('connected to redis'));

export default client;
