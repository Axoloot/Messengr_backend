/** Express router providing user related routes
 * @module auth
 * @requires express
 */

import express from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { CreateUserBody } from './entities';
import { bodyMiddleware } from '../../middlewares/validator';
import { SigninUserBody, ForgotPasswordBody, ResetPasswordBody } from './entities';
import {signin, signout, signup, forgotPassword, resetPassword} from './controllers';

const router = express.Router();

/**
 * Route serving signup form.
 * @name POST /signup
 * @function
 * @memberof module:auth
 * @inner
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} firstname - User firstname
 * @param {string} lastname - User lastname
 * @param {string} type - User type (User | Admin)
 */

router.post('/signup', bodyMiddleware(CreateUserBody), asyncHandler(async (req: any, res: any) => {
  const user = await signup(req.body);
  return res.send(user);
}));

/**
 * Route serving signin form.
 * @name POST /signin
 * @function
 * @memberof module:auth
 * @inner
 * @param {string} email - User email
 * @param {string} password - User password
 */
router.post('/signin', bodyMiddleware(SigninUserBody), asyncHandler(async (req: any, res: any) => {
  const user = await signin(req.body);
  req.session.userId = user.id;
  req.session.cookie.sameSite = 'none';
  req.session.cookie.maxAge = 30 * 24 * (60 * 60 * 1000); // 30-days valid valid token
  return res.send(user);
}));

/**
 * Logout route.
 * @name DELETE /signout
 * @function
 * @memberof module:auth
 * @inner
 */
router.delete('/signout', asyncHandler(async (req: any, res: any) => {
  signout(req);
  return res.sendStatus(StatusCodes.NO_CONTENT);
}));

/**
 * Route serving signin form.
 * @name POST /forgot-password
 * @function
 * @memberof module:auth
 * @inner
 * @param {string} email - User Email
 */
router.post('/forgot-password', bodyMiddleware(ForgotPasswordBody), asyncHandler(async (req: any, res: any) => {
  await forgotPassword(req.body.email);
  return res.send({ message: 'success' });
}));

/**
 * Route serving signin form.
 * @name PATCH /reset-password
 * @function
 * @memberof module:auth
 * @inner
 * @param {string} token - User Token from forgot password route
 * @param {string} password - User New Password
 */
router.post('/reset-password', bodyMiddleware(ResetPasswordBody), asyncHandler(async (req: any, res: any) => {
  const result = await resetPassword(req.body.token, req.body.password);
  return res.send(result);
}));

export default router;
