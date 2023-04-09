import { Role } from '@/shared/enums/authentication';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  role: Role;
}
