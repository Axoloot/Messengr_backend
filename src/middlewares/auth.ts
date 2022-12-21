import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorRo } from '../error';
import { doesUserExist, getUser } from '../components/users/controllers';
import { signout } from '../components/auth/controllers';

declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

export default async function authMiddleware(req: Request, res: Response, next: (err?: Error) => void) {
  const { userId } = req.session!;

  if (userId) {
    const userExists = await doesUserExist({ id: userId });

    if (!userExists) {
      const err = ErrorRo(StatusCodes.NOT_FOUND, `user ${userId} not found`, 'user-not-found');
      return next(err);
    }

    const user = await getUser({ id: userId });
    res.locals.user = user;

    if (!user) {
      signout(req);
      const err = ErrorRo(StatusCodes.UNAUTHORIZED, 'user must be logged in', 'not-logged-in');
      return next(err);
    }

    return next();
  }

  const err = ErrorRo(StatusCodes.UNAUTHORIZED, 'user must be logged in', 'not-logged-in');
  return next(err);
}
