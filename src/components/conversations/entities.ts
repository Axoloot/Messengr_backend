import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Min, min } from 'class-validator';

export class CreateConversationBody {
  @IsArray()
  Users: string[];

}

export class GetConversations {
}

export class UpdateConversationBody {
  @IsString()
  userId: string;
}
