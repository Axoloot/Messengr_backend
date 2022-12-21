import { PrismaClient } from '@prisma/client';

import logger from './logger';

const client = new PrismaClient();

export async function connectToDatabase() {
  try {
    logger.info('connecting to database');
    await client.$connect();
    logger.info('connected to database');
  } catch (error) {
    logger.error(`error when connecting to database:\n${error}`);
    throw error;
  }
}

export default client;
