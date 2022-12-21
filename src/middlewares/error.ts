import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../logger';
import { AppError, ErrorRo } from '../error';

export default function errorMiddleware(error: Error, _req: Request, res: Response, _next: () => void) {
  if (error instanceof AppError) {
    logger.error(`
            request: ${res.locals.id}
            key: ${error.translationKey} occurred
            message: ${error.message}`);
    return res.status((error as AppError).statusCode).send(error.toObject());
  }

  logger.error(`
        request: ${res.locals.id}
        unexpected error occurred
        stack trace:\n\n${error.stack}`);

  const err = ErrorRo(StatusCodes.INTERNAL_SERVER_ERROR, 'unexpected error occurred', 'internal-server-error');
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.toObject());
}
