import { RequestHandler } from 'express';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { plainToClass } from 'class-transformer';

import { ErrorRo } from '../error';

function validationMiddleware(type: any, where: string): RequestHandler {
  return async (req, _res, next: (err?: Error) => void) => {
    let obj;
    if (where === 'body') {
      req.body = plainToClass(type, req.body);
      obj = req.body;
    } else if (where === 'query') {
      req.query = plainToClass(type, req.query);
      obj = req.query;
    } else {
      throw new Error('Trying to use the request validation middleware on unknown field.');
    }

    const errors = await validate(obj, { whitelist: true });
    if (errors.length !== 0) {
      const message = errors.join('');
      next(ErrorRo(StatusCodes.BAD_REQUEST, message, 'invalid-form-data'));
    }
    next();
  };
}

export const bodyMiddleware = (type: any) => validationMiddleware(type, 'body');

export const queryMiddleware = (type: any) => validationMiddleware(type, 'query');
