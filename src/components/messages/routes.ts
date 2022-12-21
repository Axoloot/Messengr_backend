/** Express router providing user related routes
 * @module partner
 * @requires express
 */

import express from 'express';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import authMiddleware from '../../middlewares/auth';
import { bodyMiddleware, queryMiddleware } from '../../middlewares/validator';
import {
  CreateMessageBody,
  UpdateMessageBody
} from './entities';
import {
  createMessage,
  updateMessage
} from './controllers';

const router = express.Router();

router.use(authMiddleware);

/**
 * Create a new message.
 * @name POST /message
 * @function
 * @memberof module:partner
 * @inner
 * @param {string} content - Message name
 * @param {string} conversationId - Message name
 */
router.post('/', bodyMiddleware(CreateMessageBody), asyncHandler(async (req: any, res: any) => {
  return res.status(StatusCodes.OK).send(await createMessage(res.locals.user.id, req.body));
}));

/**
 * Delete message
 * @name PATCH /messages/:id
 * @function
 * @memberof module:partner
 * @inner
 */
router.delete('/:id', bodyMiddleware(UpdateMessageBody), asyncHandler(async (req: any, res: any) => {
  return res.status(StatusCodes.OK).send(await updateMessage(req.params.id, req.body));
}));


export default router;
