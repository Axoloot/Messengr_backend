import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GetUser {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;
}

export class ModifyUser {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsBoolean()
  @IsOptional()
  darkMode: boolean;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @IsString()
  @IsOptional()
  profilePicture: string;
}

export const userSelection: Required<Prisma.UserSelect> = {
  id: true,
  passwordResetToken: true,
  conversations: true,
  messages: true,
  email: true,
  password: false,
  lastname: true,
  firstname: true,
  createdAt: true,
  updatedAt: true,
  profilePicture: true,
  darkMode: true,
  type: true,
  _count: true,
  banned: true,
};

export class ModifyProfilePictureBody {
  picture: string;
}
