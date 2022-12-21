
import database from '../../database';
import { CreateMessageBody, UpdateMessageBody } from './entities';

export async function createMessage(userId: string, data: CreateMessageBody) {
  // const isEmailAlreadyUsed = await database.message.findUnique({ where: { email: data.email }});
  // if (isEmailAlreadyUsed) {
  //   throw ErrorRo(
  //     StatusCodes.CONFLICT,
  //     `Create message failed: email ${data.email} already used for a project`,
  //     'email-already-used-project'
  //   )
  // }

  return database.message.create({
    data: {
      ...data,
      userId
    },
  });
}

export async function updateMessage(messageId: string, data: UpdateMessageBody) {
  const message = await database.message.findUnique({ where: { id: messageId }});

  if (!message) {
    throw new Error('Message not found');
  }
  return database.message.update({
    where: { id: messageId },
    data: {
      content: 'message supprimé',
      ...data,
    },
  });
}
