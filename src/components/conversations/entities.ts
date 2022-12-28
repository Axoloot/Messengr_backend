import { IsArray, IsEmail, IsNumber, IsOptional, IsString, Min, min } from 'class-validator';

export class CreateConversationBody {
  @IsArray()
  Users: string[];

}

export class GetConversations {
}

export class UpdateConversationBody {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  picture: string;
}
