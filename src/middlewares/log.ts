import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import logger from '../logger';

export default function logMiddleware(req: Request, res: Response, next: () => void): void {
  const id = uuidv4();
  const { url } = req;
  const start = Date.now();
  res.locals.id = id;
  let method = req.method
  let status = res.statusCode

  logger.info({ message: `method=${method} url=${url} status=${status}`, labels: { 'origin': 'api' } })

  // logger.debug(`request ${res.locals.id} [${req.method}]\t ${url} sent from ${req.ip}`);
  // res.on('finish', () => {
  //   const elapsed = Date.now() - start;
  //   logger.debug(`request ${res.locals.id} [${req.method}]\t ${url} proceed on ${elapsed}ms with status ${res.statusCode}`);
  // });
  return next();
}
