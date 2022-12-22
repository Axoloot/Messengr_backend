import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { User } from '@prisma/client';
import { createCanvas } from 'canvas';

import database from '../../database';
import { ErrorRo } from '../../error';
import { userSelection, ModifyUser, GetUser } from './entities';

export function createProfilePicture(firstname: string, lastname: string) {
  const l1 = firstname[0];
  const l2 = lastname[1];

  const canvas = createCanvas(100, 100);
  const context = canvas.getContext('2d');
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  const r = 50;

  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  const colors = ['#EC8985', '#A2BFF8', '#F1CF73'];
  context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
  context.fill();

  context.font = 'bold 60px Menlo';
  context.textAlign = 'center';
  context.fillStyle = '#fff';
  context.fillText(`${firstname[0]}${lastname[0]}`, 50, 70);

  return canvas.toBuffer();
}

export async function modifyProfilePicture(userId: string, picture: Buffer) {
  await database.user.update({
    where: { id: userId },
    data: {
      profilePicture: picture.toString('base64'),
    },
    select: userSelection,
  });
}

export async function doesUserExist(where: Prisma.UserWhereUniqueInput) {
  try {
    await getMe(where);
    return true;
  } catch (error) {
    return false;
  }
}

export async function deleteUser(id: string) {
  const userExists = doesUserExist({ id });

  if (!userExists) {
    throw ErrorRo(StatusCodes.NOT_FOUND, `user ${id} not found`, 'user-not-found');
  }

  return database.user.delete({
    where: { id },
    select: userSelection,
  });
}

export async function getAllUsers() {
  const users = await database.user.findMany({
    select: userSelection,
  });

  if (users === null) {
    throw ErrorRo(StatusCodes.NOT_FOUND, 'users not found', 'user-not-found');
  }

  return users;
}

export async function getUser(body: GetUser) {
  const user = await database.user.findUnique({
    where: {
      ...body
    },
    select: userSelection,
  });

  if (user === null) {
    throw ErrorRo(StatusCodes.NOT_FOUND, `user ${JSON.stringify(body)} not found`, 'user-not-found');
  }

  return user;
}


export async function getMe(where: Prisma.UserWhereUniqueInput) {
  const user = await database.user.findUnique({
    where,
    select: userSelection,
  });

  if (user === null) {
    throw ErrorRo(StatusCodes.NOT_FOUND, `user ${JSON.stringify(where)} not found`, 'user-not-found');
  }

  return user;
}

export async function modifyUser(id: string, body: ModifyUser) {
  return database.user.update({
    where: { id },
    data: body
  });
}


// export async function verifyEmail(userId: string, token: string) {
//   if (token !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c') {
//     throw new Error('Invalid token');
//   }
//   await database.user.update({
//     where: { id: userId },
//     data: { isVerified: true },
//   });
//   return { message: 'success' };
// }
