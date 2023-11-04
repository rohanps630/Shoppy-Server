import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { BaseRequest } from '@common/base.request';
import { UserRoles } from '@/common/enums/user-role.enums';

export class LoginRequest extends BaseRequest {
  @ApiProperty({ type: String, description: 'Email id' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsNotEmpty({ message: 'password must not be null' })
  @IsString()
  password: string;
}
export class RegisterUserRequest extends BaseRequest {
  @ApiProperty({ type: String, description: 'First name' })
  @IsNotEmpty({ message: 'First name must not be null' })
  @IsString()
  first_name: string;

  @ApiProperty({ type: String, description: 'Last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ type: String, description: 'user name' })
  @IsNotEmpty({ message: 'User name must not be null' })
  @IsString()
  user_name: string;

  @ApiProperty({ type: String, description: 'Email id' })
  @IsEmail()
  @IsNotEmpty({ message: 'Email must not be null' })
  email: string;

  @ApiProperty({ type: String, description: 'Password' })
  @IsNotEmpty({ message: 'Password must not be null' })
  @IsString()
  password: string;

  @ApiProperty({ type: String, description: 'Confirm Password' })
  @IsNotEmpty({ message: 'Confirm password must not be null' })
  @IsString()
  confirmPassword: string;
}

export class AuthoriseUserResponse {
  @ApiProperty({ type: String, description: 'User Id' })
  userId: string;
  @ApiProperty({ type: String, description: 'Email Id' })
  emailId: string;
  @ApiProperty({ type: String, description: 'User Id' })
  token: string;
  constructor(userId: string, emailId: string, token: string) {
    this.userId = userId;
    this.emailId = emailId;
    this.token = token;
  }
  public static of(userId: string, emailId: string, token: string): AuthoriseUserResponse {
    return new AuthoriseUserResponse(userId, emailId, token);
  }
}

export class FindUsersResponse {
  @ApiProperty({ type: String, description: 'User Id' })
  id: string;

  @ApiProperty({ type: String, description: 'User Name' })
  userName: string;

  @ApiProperty({ type: String, description: 'first Name' })
  firstName: string;

  @ApiProperty({ type: String, description: 'Last Name' })
  lastName: string;

  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @ApiProperty({ type: String, description: 'Created At date' })
  createdAt: Date;

  @ApiProperty({ type: String, description: 'Updated At date' })
  updatedAt: Date;

  constructor(id: string, userName: string, firstName: string, lastName: string, email: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static of(
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ): FindUsersResponse {
    return new FindUsersResponse(id, userName, firstName, lastName, email, createdAt, updatedAt);
  }
}

export class GetRoleRequest extends BaseRequest {
  @ApiProperty({ enum: UserRoles, type: UserRoles, description: 'Role type' })
  // @IsString({message:"Role type must be a string"})
  @IsEnum(UserRoles)
  @IsNotEmpty({ message: 'Role type must not be empty' })
  roleType: UserRoles;
}

export class UpdateRoleRequest extends BaseRequest {
  @ApiProperty({ enum: UserRoles, type: UserRoles, description: 'User Role' })
  // @IsString({message:"Role type must be a string"})
  @IsEnum(UserRoles)
  @IsNotEmpty({ message: 'Role  must not be empty' })
  role: UserRoles;

  @ApiProperty({ type: String, description: 'User Id' })
  @IsString({ message: 'User Id must be a string' })
  // @IsEnum(UserRoles)
  @IsNotEmpty({ message: 'User id must not be empty' })
  userId: string;
}
