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
  CreateConversationBody,
  GetConversations,
  UpdateConversationBody
} from './entities';
import {
  getConversations,
  getConversation,
  createConversation,
  updateConversation
} from './controllers';

const router = express.Router();

router.use(authMiddleware);

/**
 * List created conversations
 * @name GET /conversations
 * @function
 * @memberof module:conversation
 */
router.get('/', queryMiddleware(GetConversations), asyncHandler(async (req: any, res: any) => {
  // @ts-ignore
  return res.status(StatusCodes.OK).send(await getConversations(res.locals.user.id, req.query));
}));

/**
 * Retrieve details from conversation id
 * @name GET /conversations/:id
 * @function
 * @memberof module:conversation
 * @inner
 * @param {string} id - conversation id
 */
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  return res.status(StatusCodes.OK).send(await getConversation(req.params.id));
}));

/**
 * Create a new conversation.
 * @name POST /conversations
 * @function
 * @memberof module:conversation
 * @inner
 * @param {string} name - Conversation name
 * @param {string} members - Conversation name
 */
router.post('/', bodyMiddleware(CreateConversationBody), asyncHandler(async (req: any, res: any) => {
  return res.status(StatusCodes.OK).send(await createConversation(res.locals.user.id, req.body));
}));

/**
 * Add / remove member
 * @name PATCH /conversations/:id
 * @function
 * @memberof module:conversation
 * @inner
 * @param {string} userId - user id
 */
router.patch('/:id', bodyMiddleware(UpdateConversationBody), asyncHandler(async (req: any, res: any) => {
  return res.status(StatusCodes.OK).send(await updateConversation(req.params.id, req.body));
}));


export default router;
