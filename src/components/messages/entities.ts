import { IsString } from 'class-validator';

export class CreateMessageBody {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;
}

export class GetMessages {
}

export class UpdateMessageBody {
}
