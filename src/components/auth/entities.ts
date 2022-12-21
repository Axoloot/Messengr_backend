import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class VerifyEmail {
    @IsString()
    token!: string;
}

export class ResetPasswordBody {
    @IsString()
    token!: string;

    @IsString()
    password!: string;
}

export class ForgotPasswordBody {
    @IsString()
    email!: string;
}

export class SigninUserBody {
    @IsString()
    email!: string;

    @IsString()
    password!: string;
}

export class CreateUserBody {
    @IsEmail()
    @MaxLength(256)
    email!: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    password!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(128)
    firstname!: string;

    @IsString()
    @MinLength(1)
    @MaxLength(128)
    lastname!: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    @IsIn(['en', 'fr', 'es'])
    lang: string;
}
