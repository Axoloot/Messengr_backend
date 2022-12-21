
import { StatusCodes } from 'http-status-codes';
import { ErrorRo } from '../../error';
import database from '../../database';
import { CreateConversationBody, UpdateConversationBody } from './entities';

export async function getConversations(userId: string) {
  const user = await database.user.findUnique({
    where: { id: userId },
    select: {
      conversations: true
    },
  });

  if (user === null) {
    throw ErrorRo(StatusCodes.NOT_FOUND, `user ${userId} not found`, 'user-not-found');
  }

  return user;
}

export async function getConversation(id: string) {
  const conversation = await database.conversation.findUnique({
    where: { id },
    select: {
      messages: true,
      Users: true
    }
  });
  return conversation;
}

export async function createConversation(userId: string, data: CreateConversationBody) {
  const users = [
    ...data.Users,
    userId
  ];

  return database.conversation.create({
    data: {
      ...data,
      userId,
      Users: {
        connect: users.map((id) => ({ id }))
      }
    },
  });
}

export async function updateConversation(conversationId: string, data: UpdateConversationBody) {
  const conversation = await database.conversation.findUnique({ where: { id: conversationId }, include: { Users: true, } });
  let Users;

  if (!conversation) {
    throw new Error('Conversation not found');
  }

  if (conversation.Users.find((user) => user.id === data.userId))
    Users = {
      disconnect: { id: data.userId },
    }
  else
    Users = {
      connect: { id: data.userId }
    }
  return database.conversation.update({
    where: { id: conversationId },
    data: {
      ...data,
      Users
    },
    include: {
      messages: true,
      Users: true
    }
  });;
}
