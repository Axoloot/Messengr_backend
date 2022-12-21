import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import logger from '../../logger';
import database from '../../database';
import { ErrorRo } from '../../error';
import { UserType } from '@prisma/client';
import { userSelection } from '../users/entities';
import { SigninUserBody, CreateUserBody } from './entities';
import { sendConfirmEmail, sendForgotPasswordEmail } from '../../services/mailer';
import { doesUserExist, getUser, createProfilePicture } from '../users/controllers';

export async function signup(data: CreateUserBody) {
  const userExists = await doesUserExist({ email: data.email });

  if (userExists) {
    throw ErrorRo(StatusCodes.CONFLICT, 'user already exists', 'user-already-exists');
  }

  let type: UserType = 'USER';
  if (data.type) {
    if (data.type === 'User') {
      type = 'USER';
    } else if (data.type === 'Admin') {
      type = 'ADMIN';
    } else {
      throw ErrorRo(StatusCodes.BAD_REQUEST, 'user type is incorrect', 'user-type-incorrect');
    }
  }

  data.password = await bcrypt.hash(data.password, 12);


  const newUser = await database.user.create({
    data: {
      ...data,
      type,
      profilePicture: createProfilePicture(data.firstname, data.lastname).toString('base64'),
    },
    select: userSelection,
  });

  await sendConfirmEmail(newUser.email, newUser.firstname, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');

  return newUser;
}

export async function signin({ password, email }: SigninUserBody) {
  const user = await database.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ErrorRo(StatusCodes.NOT_FOUND, 'user not found', 'user-not-found');
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw ErrorRo(StatusCodes.UNPROCESSABLE_ENTITY, 'invalid password given', 'invalid-password');
  }

  return getUser({ id: user.id });
}

export function signout(req: Express.Request) {
  req.session.destroy((e) => {
    if (e) {
      logger.error(`UNEXPECTED ! Can't delete session:\n${e}`);
      throw ErrorRo(StatusCodes.CONFLICT, 'canno\'t delete session', 'cannot-delete-session');
    }
  });
}

export async function forgotPassword(email: string) {
  const user = await database.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw ErrorRo(StatusCodes.NOT_FOUND, 'user not found', 'user-not-found');
  }
  const passwordResetToken = jwt.sign({ email: user.email }, '123', { expiresIn: '10m' });

  await database.user.update({
    where: { email },
    data: { passwordResetToken },
  });
  const encodedEmail = Buffer.from(user.email, 'binary').toString('base64');
  const encodedToken = Buffer.from(passwordResetToken, 'binary').toString('base64');
  const resetLink = new URL(`ResetPassword/token=${encodedToken}&email=${encodedEmail}&refresh=false`, 'https://fundy.cf');

  await sendForgotPasswordEmail(user.email, user.firstname, resetLink.toString());
}

export async function resetPassword(token: string, newPassword: string) {
  const passwordResetToken = Buffer.from(token, 'base64').toString();

  try {
    const payload = jwt.verify(passwordResetToken, '123', { ignoreExpiration: true });

    const user = await database.user.findFirst({ where: { passwordResetToken } });

    if (!user) {
      throw ErrorRo(StatusCodes.NOT_FOUND, 'user not found', 'user-not-found');
    }
    // @ts-ignore
    if (user.email !== payload.email) {
      throw ErrorRo(StatusCodes.NOT_FOUND, 'user not found', 'user-not-found');
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    await database.user.update({
      where: { email: user.email },
      data: { password: hashPassword },
    });
    return { message: 'success' };
  } catch (err) {
    return { err };
  }
}
