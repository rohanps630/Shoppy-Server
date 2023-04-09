import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthenticationDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
