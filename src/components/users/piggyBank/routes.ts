import express from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { getUserPiggyBang } from './controllers';

const router = express.Router();

router.get('/', asyncHandler(async (req: any, res: any) => {
  // @ts-ignore
  return res.status(StatusCodes.OK).send(await getUserPiggyBang(req.session.userId));
}));

export default router;
