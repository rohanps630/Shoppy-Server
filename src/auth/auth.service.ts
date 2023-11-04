import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifiedTokenPayload, VerifyAuthRequest, VerifyAuthRequestDto, VerifyAuthResponse } from './dto/verify-auth.dto';
import { HttpService } from '@nestjs/axios';
import { AuthoriseUserResponse, LoginRequest, RegisterUserRequest } from './dto/create-user-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './Entities/user.entity';
import { verifyHashedPassword } from '@common/utils/hash-password';
import { Errors } from '@common/Error.messages';
import { LoggerService } from '@common/logger/logger.service';
import { UserRoles } from '@/common/enums/user-role.enums';
import { MicroserviceEnvKeys } from '@/microserviceFactory.factory';
import { UniqueIdGenetrator } from '@/common/utils/unique-id.generator';
import { GetUserByRoleRequest, GetUsersByRoleResponse } from './dto/get-users-request.dto';
import { UserRepository } from './Repositories/user.repositories';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  private JWT_REFRESH_TOKEN_SECRET: string = '';
  private JWT_TOKEN_SECRET: string = '';
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private jwt: JwtService,
    private loggerService: LoggerService,
    private userRepo: UserRepository,
  ) {
    this.JWT_REFRESH_TOKEN_SECRET = configService.getOrThrow(MicroserviceEnvKeys.JWT_REFRESH_SECRET);
    this.JWT_TOKEN_SECRET = configService.getOrThrow(MicroserviceEnvKeys.JWT_SECRET);
  }

  public async register(registerUserRequest: RegisterUserRequest): Promise<AuthoriseUserResponse> {
    try {
      let isUserExisting = await this.userRepo.findByEmail(registerUserRequest.email);

      if (isUserExisting) {
        throw new BadRequestException(Errors.USER_ALREADY_EXISTS);
      }
      isUserExisting = await this.userRepo.findByUserName(registerUserRequest.user_name);
      if (isUserExisting) {
        throw new BadRequestException(Errors.USER_NAME_ALREADY_EXISTS);
      }

      const isPasswordMatch = registerUserRequest.password === registerUserRequest.confirmPassword;

      if (!isPasswordMatch) {
        throw new BadRequestException(Errors.PASSWORD_NOT_MATCH);
      }

      let user = UserEntity.builder()
        .setEmail(registerUserRequest.email)
        .setPassword(registerUserRequest.password)
        .setUserName(registerUserRequest.user_name)
        .setFirstName(registerUserRequest.first_name)
        .setLastName(registerUserRequest.last_name)

        .build();
      //save user
      this.loggerService.log('AUTH-SERVICE.register()', `${user.email} successfully created the account!`);
      user = await this.userRepo.create(user);

      if (!user) {
        throw new BadGatewayException(Errors.UNABLE_TO_CREATE);
      }
      const sessionId = UniqueIdGenetrator.gernerate();
      const token = await this.generateToken(user._id.toString(), user.email, sessionId);

      return AuthoriseUserResponse.of(user._id.toString(), user.email, token);
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof BadGatewayException) {
        throw new BadGatewayException(error.message);
      }
      throw new InternalServerErrorException(Errors.UNABLE_TO_CREATE);
    }
  }
  public async login(loginUserRequest: LoginRequest): Promise<AuthoriseUserResponse> {
    try {
      const user = await this.userRepo.findByEmail(loginUserRequest.email);

      if (!user) {
        throw new BadRequestException(Errors.USER_NOT_FOUND);
      }
      const builder = user.toBuilder().setUserName('amal123@gmail.com').build();

      // await this.userRepo.create(user)
      console.log(user);
      console.log(builder);
      const isPasswordVerified = await verifyHashedPassword(loginUserRequest.password, user.password);
      if (!isPasswordVerified) {
        throw new BadRequestException(Errors.INVALID_CREDENTIALS);
      }
      const sessionId = UniqueIdGenetrator.gernerate();
      const token = await this.generateToken(user._id, user.email, sessionId);
      this.loggerService.log('AUTH-SERVICE.login()', `${user.email} successfully logged in`);

      return AuthoriseUserResponse.of(user._id, user.email, token);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException(Errors.UNABLE_TO_LOGIN);
    }
  }

  async verify(verifyAuthRequest: VerifyAuthRequest): Promise<VerifyAuthResponse> {
    try {
      // const { token } = verifyAuthRequest;
      const requestDto = new VerifyAuthRequestDto(verifyAuthRequest);
      console.log(requestDto);
      // const tokenType = requestDto.getType();
      const token = requestDto.getToken();
      console.log(token);
      // const decodedToken = await this.decodeToken(token);
      const decodedToken = await this.decodeToken(token, this.JWT_TOKEN_SECRET);
      console.log('decodedToken', decodedToken);
      const { email } = decodedToken;
      // Check if the email exists in the database
      console.log('email', email);
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(Errors.UN_AUTHORISED);
      }
      console.log(user);

      const isValid = true;
      this.loggerService.log('AUTH-SERVICE.verify()', `${user.email} successfully verified to access api !`);

      return VerifyAuthResponse.of(user._id, user.email, isValid);
    } catch (error) {
      if (error instanceof Error) {
        this.loggerService.error('AUTH-SERVICE.verify()', `${error.message}`);
      } else {
        this.loggerService.error('AUTH-SERVICE.verify()', `${error}`);
      }

      throw new UnauthorizedException(Errors.UN_AUTHORISED);
    }
  }
  async generateToken(userId: string, emailId: string, sessionId: string): Promise<string> {
    return await this.jwt.signAsync(
      {
        email: emailId,
        id: userId,
        sessionId: sessionId,
      },
      {
        secret: this.JWT_TOKEN_SECRET,
        expiresIn: '2h',
      },
    );
  }
  async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const refreshToken = await this.jwt.signAsync({ userId, sessionId }, { secret: this.JWT_REFRESH_TOKEN_SECRET, expiresIn: '7d' });
    return refreshToken;
  }
  calculateExpiryDate(): Date {
    const daysTillExpire = 7;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysTillExpire);

    return expiryDate;
  }

  async decodeToken(token: string, secret: string): Promise<VerifiedTokenPayload> {
    try {
      return await this.jwt.verifyAsync(token, { secret: secret });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  // async _getUserRoles(getUserRoleFromTokenRequest: VerifyAuthResponse): Promise<UserRoles> {
  //   try {
  //     const user = await this.userRepo.findById(new Types.ObjectId(getUserRoleFromTokenRequest.userId));
  //     return user.role.roleType;
  //   } catch (error) {
  //     return null;
  //   }
  // }

  // async getUsersByRole(getUsersByRole: GetUserByRoleRequest): Promise<GetUsersByRoleResponse> {
  //   const users = await this.userRepo.findUsersByRoleID(role._id);

  //   return GetUsersByRoleResponse.of(
  //     users.map((user) => ({
  //       _id: user._id.toString(),
  //       dateOfBirth: Profile.dateOfBirth,
  //       subscription: Profile.subscription,
  //       profilePicture: Profile.profilePicture,
  //       phoneNumber: Profile.phoneNumber,
  //       createdAt: user.createdAt,
  //       updatedAt: user.updatedAt,
  //     })),
  //   );
  // }
}
