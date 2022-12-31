/** Express router providing user related routes
 * @module users
 * @requires express
 */

import express from 'express';
import asyncHandler from 'express-async-handler';

import authMiddleware from '../../middlewares/auth';
import {
  deleteUser, getUser, modifyUser, modifyProfilePicture, getAllUsers, getMe,
} from './controllers';
import { bodyMiddleware } from '../../middlewares/validator';
import { ModifyProfilePictureBody, ModifyUser } from './entities';

const router = express.Router();

router.use(authMiddleware);

/**
 * Retrieve one users
 * @name GET /
 * @function
 * @memberof module:users
 * @inner
 */
router.get('/:who', asyncHandler(async (_req: any, res: any) => {
  const user = await getUser(_req.params.who);
  return res.send(user);
}));

/**
 * Retrieve all users
 * @name GET /
 * @function
 * @memberof module:users
 * @inner
 * @param {string} email - email (optional)
 * @param {string} firstname - firstname
 * @param {string} lastname - lastname
 */
router.get('/', asyncHandler(async (_req: any, res: any) => {
  const user = await getAllUsers();
  return res.send(user);
}));

/**
 * Retrieve logged user data
 * @name GET /me
 * @function
 * @memberof module:users
 * @inner
 */
router.get('/me', asyncHandler(async (_req: any, res: any) => {
  const user = await getMe({ id: res.locals.user.id });
  return res.send(user);
}));

/**
 * Update logged user data
 * @name PATCH /me
 * @function
 * @memberof module:users
 * @inner
 * @param {string} email - email
 * @param {string} firstname - firstname
 * @param {string} lastname - lastname
 */
router.patch('/me', bodyMiddleware(ModifyUser), asyncHandler(async (req: any, res: any) => {
  const user = await modifyUser(res.locals.user.id, req.body);
  return res.send(user);
}));

router.delete('/me', asyncHandler(async (req: any, res: any) => {
  const user = await deleteUser(res.locals.user.id);
  return res.send(user);
}));

/**
 * Update logged user profile pic
 * @name PATCH /me/profile-picture
 * @function
 * @memberof module:users
 * @inner
 * @param {string} picture - Picture
 */
router.patch('/me/profile-picture', bodyMiddleware(ModifyProfilePictureBody), asyncHandler(async (req: any, res: any) => {
  console.log(req.body.picture)
  console.log(Buffer.from(req.body.picture, 'base64'))
  
  const user = await modifyProfilePicture(res.locals.user.id, Buffer.from(req.body.picture, 'base64'));
  return res.send(user);
}));

// /**
//  * Route  form.
//  * @name POST /me/verify-email
//  * @function
//  * @memberof module:auth
//  * @inner
//  * @param {string} token - User Token from signup email
//  */
// router.post('/me/verify-email', bodyMiddleware(VerifyEmail), asyncHandler(async (req: any, res: any) => {
//   const result = await verifyEmail(res.locals.user.id, req.body.token);
//   return res.send(result);
// }));

export default router;
