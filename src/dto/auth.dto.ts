import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Full name is required' })
  @Matches(/^(?!\s*$)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/, {
    message: 'Full name must contain only letters and valid spaces between words',
  })
  @MinLength(4, { message: 'Full name must be at least 4 characters long' })
  @MaxLength(50, { message: 'Full name must be at most 50 characters long' })
  fullName: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password: string;
}