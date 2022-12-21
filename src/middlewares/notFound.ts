import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(StatusCodes.NOT_FOUND).send(`route '${req.originalUrl}' not found, verify you didn't forget an URI param`);
}
